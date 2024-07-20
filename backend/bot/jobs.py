import datetime
import logging
from typing import Tuple
from urllib.parse import urljoin

import requests
from django_rq import job

from django.conf import settings
from django.core.cache import cache

from archive.models import DiscordAuthor, DiscordChannel, DiscordMessage, Identity, Tag
from bot.utils import MessageType, discord_headers, send_discord_message

logger = logging.getLogger(__name__)


def archive_channel(channel_id: str, tag: Tag) -> Tuple[DiscordChannel, bool]:
    """Fetch a Channel from Discord's API and persist to database

    Args:
        channel_id (str): Discord channel ID
        tag (Tag): Tag instance

    Returns:
        channel (DiscordChannel), created (boolean)
    """
    url = urljoin(settings.DISCORD_BASE_URL, f"channels/{channel_id}")
    response = requests.get(url, headers=discord_headers)
    response.raise_for_status()
    data = response.json()
    (channel, created) = DiscordChannel.objects.get_or_create(discord_id=channel_id)
    channel.name = data.get("name")
    channel.topic = data.get("topic")
    channel.tag = tag
    channel.save()
    return channel, created


def archive_messages(channel: DiscordChannel, before: str) -> Tuple[str, bool]:
    """Fetch messages from Discord's API and persist to database
    This method will fetch and archive messages in groups of 100, and will return True
    if there are more messages  (and this method should be run again)

    Args:
        - channel (DiscordChannel): Channel to archive
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
        author_id = message_details.get("author", {}).get("id")
        author_username = message_details.get("author", {}).get("username")

        author = cache.get(f"author:{author_id}")
        identity = cache.get(f"identity:{author_id}{author_username}")

        if not author:
            (author, _) = DiscordAuthor.objects.get_or_create(discord_id=author_id)
            cache.set(f"author:{author_id}", author, 120)

        if not identity:
            (identity, _) = Identity.objects.get_or_create(
                discord_author=author, name=author_username
            )
            cache.set(f"identity:{author_id}{author_username}", identity, 120)

        (message, _) = DiscordMessage.objects.get_or_create(
            discord_id=message_details.get("id"), channel=channel
        )
        message.author = author
        message.timestamp = datetime.datetime.fromisoformat(
            message_details.get("timestamp")
        )
        message.raw_message = message_details
        message.save()

    try:
        return data[-1].get("id"), True
    except IndexError:
        return None, False


@job
def archive_discord_channel(channel_id: str, tag_slug: str, user_id: str):
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
        before = None
        while True:
            before, more = archive_messages(channel=channel, before=before)
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
