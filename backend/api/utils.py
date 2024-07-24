from typing import Callable

from graphql import GraphQLError
from functools import wraps


def login_required(f: Callable) -> Callable:
    """Decorator for graphene resolvers to require user login.
    Raise a GraphQLError if the user is not authenticated or valid.
    """

    @wraps(f)
    def inner(*args, **kwargs):
        info = args[1]
        if info.context and info.context.user:
            if info.context.user.is_authenticated and info.context.user.is_active:
                return f(*args, **kwargs)
        raise GraphQLError("Authentication required for query.")

    return inner


def staff_required(f: Callable) -> Callable:
    """Decorator for graphene resolvers to require user staff permissions.
    Raise a GraphQLError if the user is not staff.
    """

    @wraps(f)
    def inner(*args, **kwargs):
        info = args[1]
        if info.context and info.context.user:
            if info.context.user.is_staff:
                return f(*args, **kwargs)
        raise GraphQLError("Permission level insufficient for this query.")

    return inner
