import os
from typing import Callable
from uuid import uuid4

from django.db import models


def make_upload_path(path: str) -> Callable[models.Model, str]:
    """When used with a ImageField or FileField, returns
    an upload path with a randomly generated filename.

    Args:
        - instance: a Model instance
        - filename: user-uploaded file name as a string

    Returns:
        Upload Path (as a string)

    Example:

        class MyModel(models.Model):
            my_image = models.ImageField(upload_to=make_upload_path("/files"), null=True, blank=True)
    """

    def wrapper(instance: models.Model, filename: str) -> str:
        ext = filename.split(".")[-1]
        filename = "{}.{}".format(uuid4().hex, ext)
        return os.path.join(path, filename)

    return wrapper
