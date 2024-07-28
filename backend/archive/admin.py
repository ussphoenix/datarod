from django.contrib import admin

from archive.models import Channel, Message, Nickname, Tag


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    search_fields = ["name", "slug"]
    search_help_text = "Search by Tag name or slug"
    list_display = ["name", "slug", "start_date"]
    list_filter = ["tag_type"]


@admin.register(Channel)
class ChannelAdmin(admin.ModelAdmin):
    search_fields = ["name", "discord_id"]
    search_help_text = "Search by Channel name or Discord ID"
    list_display = ["name", "tag", "archive_date"]
    list_filter = ["tag"]


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    search_fields = [
        "nickname__name",
        "channel__name",
        "channel__tag__slug",
        "channel__tag__name",
    ]
    search_help_text = "Search by Nickname, Channel name, or Tag name"
    list_display = ["channel", "nickname", "__str__"]
    list_filter = ["channel__tag", "nickname"]


@admin.register(Nickname)
class NicknameAdmin(admin.ModelAdmin):
    search_fields = ["name", "authors__discord_id"]
    search_help_text = "Search by name or Discord ID"
    list_display = ["name", "discord_ids_for_nickname"]
    filter_horizontal = ["authors"]

    def discord_ids_for_nickname(self, obj: "Nickname") -> str:
        return ", ".join([author.discord_id for author in obj.authors.all()])
