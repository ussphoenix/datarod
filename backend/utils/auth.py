from social_core.backends.discord import DiscordOAuth2
from social_core.backends.oauth import BaseOAuth2
from social_core.exceptions import AuthForbidden

from django.conf import settings


class Discord(DiscordOAuth2):
    """Subclass DiscordOAuth2 backend to add the `guilds` scope and
    then request the user's guild list.
    Used in the pipeline to confirm the user is in our Discord guild
    """

    DEFAULT_SCOPE = ["identify", "guilds", "guilds.members.read"]

    def user_data(self, access_token, *args, **kwargs):
        # Basic user data from superclass
        data = super().user_data(access_token, *args, **kwargs)

        # Fetch and append guild information (roles)
        url = f"https://{self.HOSTNAME}/api/users/@me/guilds/{settings.DISCORD_GUILD_ID}/member"
        auth_header = {"Authorization": "Bearer %s" % access_token}
        try:
            response = self.get_json(url, headers=auth_header)
        except requests.exceptions.HTTPError:
            # If user not in guild, stop right here
            raise AuthForbidden(backend)
        else:
            guild_data = {"roles": response.get("roles", [])}
        data["guild"] = guild_data
        return data


def set_guild_permissions(user, response, *args, **kwargs):
    """If the user has the proper guild role, promote them to staff
    Otherwise, assume the role was removed and demote
    """
    should_be_staff = settings.DISCORD_GUILD_STAFF_ROLE_ID in response.get(
        "guild", {}
    ).get("roles")

    if user.is_staff and not should_be_staff:
        user.is_staff = False
        user.save()

    if not user.is_staff and should_be_staff:
        user.is_staff = True
        user.save()
