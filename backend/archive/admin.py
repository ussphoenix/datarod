from django.contrib import admin

from archive.models import Author, Channel, Message, Nickname, Tag

admin.site.register(Tag)
admin.site.register(Channel)
admin.site.register(Author)
admin.site.register(Message)
admin.site.register(Nickname)
