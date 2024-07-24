import graphene

from api.types import (
    AuthorQuery,
    ChannelQuery,
    MeQuery,
    MessageQuery,
    NicknameQuery,
    TagQuery,
    TagMutation,
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


class Mutation(graphene.ObjectType):
    tag = TagMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
