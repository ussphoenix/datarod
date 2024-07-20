import strawberry_django
from strawberry import auto
from archive.models import DiscordChannel, Tag, DiscordMessage, DiscordAuthor, Identity


@strawberry_django.type(Tag)
class Tag:
    id: auto
    name: auto
    slug: auto
    tag_type: auto
    description: auto
    start_date: auto
    end_date: auto


@strawberry_django.type(DiscordAuthor)
class Author:
    id: auto
    identities: list["Identity"]


@strawberry_django.type(Identity)
class Identity:
    id: auto
    discord_author: Author
    name: auto


@strawberry_django.type(DiscordChannel)
class Channel:
    id: auto
    name: auto
    tag: Tag


@strawberry_django.type(DiscordMessage)
class Message:
    id: auto
    channel: Channel
    timestamp: auto
    raw_message: auto
    author: Author
