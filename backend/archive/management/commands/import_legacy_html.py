import datetime
import json
import sys

from bs4 import BeautifulSoup

from django.conf import settings
from django.core.management.base import BaseCommand
from django.utils.timezone import make_aware

from archive.models import Channel, Message, Nickname, Tag


class Command(BaseCommand):
    help = "Import a legacy HTML archive into the database"

    def add_arguments(self, parser):
        parser.add_argument(
            "--tag",
            required=True,
            action="store",
            help="Tag Slug",
        )
        parser.add_argument(
            "--channel",
            required=True,
            action="store",
            help="Channel Name",
        )
        parser.add_argument(
            "--file",
            required=True,
            action="store",
            help="HTML File",
        )

    def handle(self, *args, **options):
        tag_slug = options["tag"]
        channel_name = options["channel"]
        file_name = options["file"]
        tag = Tag.objects.get(slug=tag_slug)
        channel, _ = Channel.objects.get_or_create(name=channel_name, tag=tag)

        with open(file_name) as fp:
            soup = BeautifulSoup(fp, features="html.parser")
            messages = soup.find_all("div", {"class": "chatlog__messages"})

            data_group = []

            for message in messages:
                author_name = None
                author_id = None
                timestamp = None
                message_id = None
                content = None
                if authors := message.find_all(
                    "span", {"class": "chatlog__author-name"}
                ):
                    author = authors[0]
                    author_name = author.get_text()
                    author_id = author.attrs.get("data-user-id")
                if timestamps := message.find_all(
                    "span", {"class": "chatlog__timestamp"}
                ):
                    timestamp = make_aware(
                        datetime.datetime.strptime(
                            timestamps[0].get_text(), "%d-%b-%y %I:%M %p"
                        )
                    )

                if message_body := message.find_all(
                    "div", {"class": "chatlog__message"}
                ):
                    body = message_body[0]
                    message_id = body.attrs.get("data-message-id")
                    content = body.get_text().replace("\n\n", "")
                if all([author_id, author_name, message_id, content]):
                    data_group.append(
                        {
                            "author_name": author_name,
                            "author_id": author_id,
                            "timestamp": timestamp,
                            "message_id": message_id,
                            "content": content,
                        }
                    )

            for group in data_group:
                discord_json = {
                    "id": group["message_id"],
                    "tts": False,
                    "type": 0,
                    "attachments": [],
                    "embeds": [],
                    "mentions": [],
                    "mention_everyone": False,
                    "pinned": False,
                    "edited_timestamp": None,
                    "mention_roles": [],
                    "reactions": [],
                    "content": group["content"],
                    "channel_id": None,
                    "author": {
                        "username": group["author_name"],
                        "discriminator": None,
                        "avatar": None,
                        "id": group["author_id"],
                    },
                }
                nickname = Nickname.get_or_create_with_author(
                    name=group["author_name"], discord_id=group["author_id"]
                )

                message, _ = Message.objects.get_or_create(
                    discord_id=group["message_id"],
                    channel=channel,
                    defaults={
                        "nickname": nickname,
                        "raw_message": discord_json,
                        "timestamp": group["timestamp"],
                    },
                )
