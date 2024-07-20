import strawberry
import strawberry_django
from strawberry_django.optimizer import DjangoOptimizerExtension

from api.types import Author, Channel, Message, Nickname, Tag


@strawberry.type
class Query:
    tags: list[Tag] = strawberry_django.field()
    channels: list[Channel] = strawberry_django.field()
    messages: list[Message] = strawberry_django.field()
    nicknames: list[Nickname] = strawberry_django.field()
    authors: list[Author] = strawberry_django.field()


schema = strawberry.Schema(
    query=Query,
    extensions=[
        DjangoOptimizerExtension,
    ],
)
