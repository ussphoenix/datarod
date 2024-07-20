import logging
from enum import Enum
from urllib.parse import urljoin

import requests

from django.conf import settings

logger = logging.getLogger(__name__)

discord_headers = {
    "Authorization": f"Bot {settings.DISCORD_TOKEN}",
    "Content-Type": "application/json",
}


class MessageType(Enum):
    SUCCESS = 5763719
    ERROR = 15548997


def send_discord_message(user_id: str, message_type: MessageType, message: str):
    """Send a direct message to a user

    Args:
        user_id (str): Discord user ID
        message_type (MessageType)
        message (str): message body
    """

    # Create a DM with a user
    try:
        url = urljoin(settings.DISCORD_BASE_URL, f"users/@me/channels")
        payload = {"recipient_id": user_id}
        response = requests.post(url, headers=discord_headers, json=payload)
        response.raise_for_status()
        channel_id = response.json().get("id")
    except Exception as e:
        logger.exception(e)
        return

    # Send a message to the DM channel
    try:
        if channel_id:
            url = urljoin(settings.DISCORD_BASE_URL, f"channels/{channel_id}/messages")
            message_title = ""
            if message_type is MessageType.SUCCESS:
                message_title = "Job Done!"
            elif message_type is MessageType.ERROR:
                message_title = "Uh Oh..."
            payload = {
                "embeds": [
                    {
                        "title": message_title,
                        "description": message,
                        "color": message_type.value,
                    },
                ],
            }
            response = requests.post(url, headers=discord_headers, json=payload)
    except Exception as e:
        logger.exception(e)
        return
