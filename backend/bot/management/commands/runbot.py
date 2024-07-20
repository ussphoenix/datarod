from django.conf import settings
from django.core.management.base import BaseCommand

from bot.client import client


class Command(BaseCommand):
    help = "Runs a Discord bot event loop until killed"

    def handle(self, *args, **options):
        self.stdout.write("Starting Discord bot event loop...")
        client.run(settings.DISCORD_TOKEN)
