from enum import Enum
from typing import List

import discord
from asgiref.sync import sync_to_async
from discord import app_commands, http

from django.conf import settings

from archive.models import Tag
from bot.jobs import archive_discord_channel

# Monkeypatch discord.http to use reverse proxy for Discord's API
http.Route.BASE = f"{settings.DISCORD_BASE_URL}/api/v10"
http._set_api_version = lambda v: f"{settings.DISCORD_BASE_URL}/api/v{v}"


GUILD = discord.Object(id=settings.DISCORD_GUILD_ID)


def can_access_bot(interaction: discord.Interaction) -> bool:
    """Return True if the interaction is from the configured guild"""
    if interaction.guild.id != GUILD.id:
        return False
    return True


class BotClient(discord.Client):
    def __init__(
        self,
        intents: discord.Intents,
        *args,
        **kwargs,
    ):
        super().__init__(intents=intents, *args, **kwargs)
        self.tree = app_commands.CommandTree(self)

    async def setup_hook(self):
        self.tree.copy_global_to(guild=GUILD)
        await self.tree.sync(guild=GUILD)


intents = discord.Intents.default()
client = BotClient(intents=intents)


@client.event
async def on_ready():
    print(f"Logged in as {client.user} (ID: {client.user.id})")


async def tag_autocomplete(
    interaction: discord.Interaction, current: str
) -> List[app_commands.Choice[str]]:
    """Render autocomplete suggestions for tags"""
    tags = [tag.slug async for tag in Tag.objects.filter().order_by("pk")]
    return [
        app_commands.Choice(name=tag, value=tag)
        for tag in tags
        if current.lower() in tag.lower()
    ][:20]


@client.tree.command(
    name="archive",
    description="Archives the current channel to the Phoenix Archive",
    guild=GUILD,
)
@app_commands.allowed_contexts(guilds=True, dms=False, private_channels=False)
@app_commands.check(can_access_bot)
@app_commands.autocomplete(tag=tag_autocomplete)
async def archive(
    interaction: discord.Interaction, tag: str, after: str = None, before: str = None
):
    await interaction.response.send_message(
        f"Archiving channel `#{interaction.channel.name}` to tag `{tag}`. This might take a minute, I'll message you when I'm done.",
        ephemeral=True,
    )
    await sync_to_async(archive_discord_channel.delay)(
        channel_id=interaction.channel.id,
        tag_slug=tag,
        user_id=interaction.user.id,
        after=after,
        before=before,
    )
