import sys

from django.conf import settings
from django.core.management.base import BaseCommand

from archive.models import Nickname
from bot.jobs import update_color_from_roles


class Command(BaseCommand):
    help = "Populate the color of all un-colored nicknames from the Discord API"

    def handle(self, *args, **options):
        nicknames = Nickname.objects.all()
        for nickname in nicknames.iterator():
            try:
                update_color_from_roles(nickname)
            except Exception:
                pass
