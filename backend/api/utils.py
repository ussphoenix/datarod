from typing import Callable

from graphql import GraphQLError


def login_required(f: Callable) -> Callable:
    """Decorator for graphene resolvers to require user login.
    Raise a GraphQLError if the user is not authenticated or valid.
    """

    def inner(root, info):
        if info.context and info.context.user:
            if info.context.user.is_authenticated and info.context.user.is_active:
                return f(root, info)
        raise GraphQLError("Authentication required for query.")

    return inner


def staff_required(f: Callable) -> Callable:
    """Decorator for graphene resolvers to require user staff permissions.
    Raise a GraphQLError if the user is not staff.
    """

    def inner(root, info):
        if info.context and info.context.user:
            if info.context.user.is_staff:
                return f(root, info)
        raise GraphQLError("Permission level insufficient for this query.")

    return inner
