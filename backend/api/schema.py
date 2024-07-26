import graphene

from api.types import (
    ChannelQuery,
    MeQuery,
    MessageQuery,
    NicknameQuery,
    TagMutation,
    TagQuery,
)


class Query(
    TagQuery,
    ChannelQuery,
    NicknameQuery,
    MessageQuery,
    MeQuery,
    graphene.ObjectType,
): ...


class Mutation(graphene.ObjectType):
    tag = TagMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
