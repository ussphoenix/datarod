import graphene

from api.types import AuthorQuery, ChannelQuery, MessageQuery, NicknameQuery, TagQuery


class Query(
    TagQuery,
    ChannelQuery,
    AuthorQuery,
    NicknameQuery,
    MessageQuery,
    graphene.ObjectType,
): ...


schema = graphene.Schema(query=Query)
