from django.contrib import admin

from archive.models import DiscordChannel, DiscordMessage, Identity, Tag

admin.site.register(Tag)
admin.site.register(DiscordChannel)
admin.site.register(Identity)
admin.site.register(DiscordMessage)
