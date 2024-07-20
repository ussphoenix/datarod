import strawberry_django
import strawberry
from strawberry_django.optimizer import DjangoOptimizerExtension

from api.types import Tag, Channel, Message, Identity, Author


@strawberry.type
class Query:
    tags: list[Tag] = strawberry_django.field()
    channels: list[Channel] = strawberry_django.field()
    messages: list[Message] = strawberry_django.field()
    identities: list[Identity] = strawberry_django.field()
    author: list[Author] = strawberry_django.field()


schema = strawberry.Schema(
    query=Query,
    extensions=[
        DjangoOptimizerExtension,
    ],
)
