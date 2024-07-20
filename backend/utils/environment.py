import os
from typing import Union

from django.core.exceptions import ImproperlyConfigured


def strtobool(value: str) -> bool:
    return True if value.lower() in ("true", "t", "yes", "y", "1") else False


def get_env(
    var_name,
    default: any = None,
    is_bool: bool = False,
    is_int: bool = False,
    is_float: bool = False,
    is_list: bool = False,
    is_required: bool = False,
) -> Union[str, bool, int, float]:
    """Loads a value from the environment variable <var_name> and returns
    that value, optionally explicitly cast as a type.
    If the environment variable is not set, return <default>.

    Args:
        var_name: name of the environment variable
        default (optional, default None): returned if environment variable is unset
        is_bool (optional, default False): if True, a Bool will be returned
        is_int (optional, default False): if True, an int will be returned
        is_float (optional, default: False): if True, a float will be returned
        is_list (optional, default False): if True, a List will be returned.
                                          This option can be combined with other is_type options.
                                          For example, is_list and is_bool would return a List[Bool].
        is_required (optional, default False): if True, an exception will be raised for a missing environment variable

    Returns:
        Bool: if is_bool is True, else
        int: if is_int is True, else
        float: if is_float is True, else
        str

    Raises:
        ImproperlyConfigured: if is_required is True and a variable named <var_name> could not be found.

    Example:
        Assuming the following environment:
            TEST_STRING="welcome"
            TEST_LIST="1,2,3"
            TEST_INT="42"
            TEST_BOOL="true"

        Then:
            get_env('TEST_STRING')
            >>> "welcome"

            get_env('TEST_INT')
            >>> "42"

            get_env('TEST_INT', is_int=True)
            >>> 42

            get_env('TEST_BOOL', is_bool=True)
            >>> True

            get_env('TEST_LIST', is_int=True, is_list=True)
            >>> [1, 2, 3]
    """
    try:
        env_var = os.environ[var_name]
    except KeyError:
        if is_required:
            raise ImproperlyConfigured(
                f"The {var_name} environment variable is required, but was not set."
            )
        return default

    # Convert env_var to list, even if a single item
    if is_list:
        env_var_list = env_var.replace(" ", "").split(",")
    else:
        env_var_list = [
            env_var,
        ]

    # For each variable in the list, convert to type
    cast_list = []
    for env_var_item in env_var_list:
        if is_bool:
            cast_list.append(bool(strtobool(env_var_item)))
        elif is_int:
            cast_list.append(int(env_var_item))
        elif is_float:
            cast_list.append(float(env_var_item))
        else:
            cast_list.append(env_var_item)

    # Return the entire list if list requested, else return first item
    if is_list:
        return cast_list
    return cast_list[0]
