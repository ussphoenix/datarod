import datetime
import logging
from typing import List, Tuple
from urllib.parse import urljoin

import requests
from django_rq import job

from django.conf import settings
from django.core.cache import cache

from archive.models import Channel, Message, Nickname, Tag
from bot.utils import MessageType, discord_headers, send_discord_message

logger = logging.getLogger(__name__)


def archive_channel(channel_id: str, tag: Tag) -> Tuple[Channel, bool]:
    """Fetch a Channel from Discord's API and persist to database

    Args:
        channel_id (str): Discord channel ID
        tag (Tag): Tag instance

    Returns:
        channel (Channel), created (boolean)
    """
    url = urljoin(settings.DISCORD_BASE_URL, f"channels/{channel_id}")
    response = requests.get(url, headers=discord_headers)
    response.raise_for_status()
    data = response.json()
    (channel, created) = Channel.objects.get_or_create(discord_id=channel_id, tag=tag)
    channel.name = data.get("name")
    channel.topic = data.get("topic")
    channel.save()
    return channel, created


def archive_messages(
    channel: Channel, before: str, after: str = None
) -> Tuple[str, bool]:
    """Fetch messages from Discord's API and persist to database
    This method will fetch and archive messages in groups of 100, and will return True
    if there are more messages  (and this method should be run again)

    Args:
        - channel (Channel): Channel to archive
        - before (str): Last Discord message id archived, start from here

    Returns:
        last message id (str), more messages (boolean)
    """
    url = urljoin(settings.DISCORD_BASE_URL, f"channels/{channel.discord_id}/messages")
    params = {"limit": 100, "before": before}
    response = requests.get(url, headers=discord_headers, params=params)
    response.raise_for_status()
    data = response.json()

    for message_details in data:
        # If this message matches our "after" constraint, stop and do not archive it
        if message_details.get("id") == after:
            return None, False

        (message, created) = Message.objects.get_or_create(
            discord_id=message_details.get("id"), channel=channel
        )
        if not created:
            continue  # Don't re-archive a message we have previously archived
        nickname = archive_user(user_id=message_details.get("author", {}).get("id"))
        if nickname:
            message.nickname = nickname
        message.timestamp = datetime.datetime.fromisoformat(
            message_details.get("timestamp")
        )
        message.raw_message = message_details
        message.save()
    try:
        return data[-1].get("id"), True
    except IndexError:
        return None, False


def archive_user(user_id: str) -> Nickname:
    """Fetch a member profile from the Discord API, and create an Identity
    for each unique combination of a user ID and nickname.
    Cache the result for a short time as this job may be called several
    times in succession for a user.

    Args:
        user_id (str): Discord user ID
    """
    if nickname := cache.get(f"user-nickname-{user_id}"):
        return nickname

    try:
        # Get member details from Discord
        url = urljoin(
            settings.DISCORD_BASE_URL,
            f"guilds/{settings.DISCORD_GUILD_ID}/members/{user_id}",
        )
        response = requests.get(url, headers=discord_headers)
        response.raise_for_status()
        data = response.json()

        # Get or create a nickname
        nick = data.get("nick")
        if not nick:
            nick = data.get("user", {}).get("username")

        # Merge the user ID and avatar ID to store as the avatar data
        # (The path to an avatar is https://cdn.discordapp.com/avatars/<USER_ID>/<AVATAR_ID>.webp)
        if avatar := data.get("user", {}).get("avatar"):
            avatar = f"{user_id}/{avatar}"

        nickname = Nickname.get_or_create_with_author(
            name=nick, avatar=avatar, discord_id=user_id
        )

        # Fetch nickname color as a background job
        update_color_from_roles.delay(nickname)

        cache.set(f"user-nickname-{user_id}", nickname, 120)
    except Exception as e:
        logger.exception(e)
        return

    return nickname


@job
def update_color_from_roles(nickname: Nickname):
    """Use the Discord API to update the nickname color
    Fetch the user's roles in the guild and use the role's color

    Args:
        nickname: Nickname instance
    """
    # Get guild role list from Discord
    guild_roles = cache.get("guild-roles")
    if not guild_roles:
        try:
            url = urljoin(
                settings.DISCORD_BASE_URL,
                f"guilds/{settings.DISCORD_GUILD_ID}/roles",
            )
            response = requests.get(url, headers=discord_headers)
            response.raise_for_status()
            data = response.json()

            # Sort by position key, filter out color-less roles and roles with users
            # that are not displayed independently from other roles
            data.sort(key=lambda x: x["position"], reverse=True)
            data = list(
                filter(lambda x: all([x["color"] > 0, x["hoist"] == True]), data)
            )
            cache.set("guild-roles", data, 120)
            guild_roles = data
        except Exception as e:
            logger.exception(e)
            return

    try:
        # Get member details from Discord
        url = urljoin(
            settings.DISCORD_BASE_URL,
            f"guilds/{settings.DISCORD_GUILD_ID}/members/{nickname.last_author.discord_id}",
        )
        response = requests.get(url, headers=discord_headers)
        response.raise_for_status()
        data = response.json()

        # Filter roles list by user's roles
        roles = list(filter(lambda x: x["id"] in data.get("roles", []), guild_roles))
        principal_role = roles[0]

        # Store color on nickname if role has a color
        if role_color := principal_role.get("color"):
            if role_color > 0:
                nickname.color = "{:x}".format(role_color).upper()
                nickname.save()

    except Exception as e:
        logger.exception(e)
        return


@job
def archive_discord_channel(
    channel_id: str, tag_slug: str, user_id: str, after: str = None, before: str = None
):
    """Fetch messages from Discord's API and persist to database
    This is a long running job and is expected to be run in rq

    Args:
        channel_id (str): Discord channel ID
        tag_slug (Tag.slug) Tag lookup slug
        user_id (str): Requesting user's Discord user ID
    """

    # Confirm that the tag exists
    try:
        tag = Tag.objects.get(slug=tag_slug)
    except Tag.DoesNotExist:
        send_discord_message(
            user_id=user_id,
            message_type=MessageType.ERROR,
            message=f"You tried to archive a channel to the tag: `{tag_slug}`, but that tag does not exist.",
        )
        return

    # Archive channel details
    try:
        (channel, created) = archive_channel(channel_id=channel_id, tag=tag)
    except Exception as e:
        send_discord_message(
            user_id=user_id,
            message_type=MessageType.ERROR,
            message=f"Sorry, something went wrong with your archive request. Please have engineering go take a look.",
        )
        logger.exception(e)
        return

    # Archive all messages in channel - this loop will continue until complete
    try:
        before = before or None
        while True:
            before, more = archive_messages(
                channel=channel, before=before, after=after or None
            )
            if not more:
                break
    except Exception as e:
        send_discord_message(
            user_id=user_id,
            message_type=MessageType.ERROR,
            message=f"Sorry, something went wrong with your archive request. Please have engineering go take a look.",
        )
        logger.exception(e)
        return

    if created:
        send_discord_message(
            user_id=user_id,
            message_type=MessageType.SUCCESS,
            message=f"I've archived `#{channel.name}` and all of its messages to the `{tag.name}` tag",
        )
    else:
        send_discord_message(
            user_id=user_id,
            message_type=MessageType.SUCCESS,
            message=f"I've previously archived `#{channel.name}`, so I've updated my archives with new data",
        )
