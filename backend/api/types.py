from typing import Optional

import strawberry_django
from strawberry import auto

from archive.models import Author, Channel, Message, Nickname, Tag


@strawberry_django.type(Tag)
class Tag:
    id: auto
    name: auto
    slug: auto
    tag_type: auto
    description: auto
    start_date: auto
    end_date: auto


@strawberry_django.type(Author)
class Author:
    id: auto
    discord_id: auto
    name: auto


@strawberry_django.type(Nickname)
class Nickname:
    id: auto
    discord_author: Author
    name: auto
    avatar: auto
    start_date: auto
    end_date: auto


@strawberry_django.type(Channel)
class Channel:
    id: auto
    discord_id: auto
    name: auto
    tag: Tag
    topic: auto
    archive_date: auto


@strawberry_django.type(Message)
class Message:
    id: auto
    discord_id: auto
    channel: Channel
    timestamp: auto
    raw_message: auto
    nickname: Optional[Nickname]
