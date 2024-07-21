from social_core.backends.discord import DiscordOAuth2
from social_core.backends.oauth import BaseOAuth2
from social_core.exceptions import AuthForbidden

from django.conf import settings


class Discord(DiscordOAuth2):
    """Subclass DiscordOAuth2 backend to add the `guilds` scope and
    then request the user's guild list.
    Used in the pipeline to confirm the user is in our Discord guild
    """

    DEFAULT_SCOPE = ["identify", "guilds"]

    def user_data(self, access_token, *args, **kwargs):
        # Basic user data from superclass
        data = super().user_data(access_token, *args, **kwargs)

        # Fetch and append guild information
        url = "https://%s/api/users/@me/guilds" % self.HOSTNAME
        auth_header = {"Authorization": "Bearer %s" % access_token}
        guilds = self.get_json(url, headers=auth_header)
        guild_ids = []
        if guilds:
            guild_ids = [g.get("id") for g in guilds]
        data["guilds"] = guild_ids
        return data


def guild_required_pipeline(backend, response, *args, **kwargs):
    """Make sure that the user is a member of the configured guild"""
    if backend.name.lower() == "discord":
        if str(settings.DISCORD_GUILD_ID) not in response.get("guilds", []):
            raise AuthForbidden(backend)
