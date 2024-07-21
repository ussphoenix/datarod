import graphene

from api.types import (
    AuthorQuery,
    ChannelQuery,
    MeQuery,
    MessageQuery,
    NicknameQuery,
    TagQuery,
)


class Query(
    TagQuery,
    ChannelQuery,
    AuthorQuery,
    NicknameQuery,
    MessageQuery,
    MeQuery,
    graphene.ObjectType,
): ...


schema = graphene.Schema(query=Query)
