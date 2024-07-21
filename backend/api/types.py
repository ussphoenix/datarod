import graphene
from graphene import ObjectType, relay
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from archive.models import Author, Channel, Message, Nickname, Tag


class TagType(DjangoObjectType):
    class Meta:
        model = Tag
        fields = (
            "id",
            "name",
            "slug",
            "tag_type",
            "description",
            "start_date",
            "end_date",
        )
        filter_fields = {
            "name": ["exact", "icontains", "istartswith"],
            "slug": ["exact"],
            "tag_type": ["exact"],
            "start_date": ["gt", "lt"],
            "end_date": ["gt", "lt"],
        }
        interfaces = (relay.Node,)


class TagQuery(ObjectType):
    tag = relay.Node.Field(TagType)
    tags = DjangoFilterConnectionField(TagType)

    def resolve_tags(root, info):
        return Tag.objects.all()


class ChannelType(DjangoObjectType):
    class Meta:
        model = Channel
        fields = ("discord_id", "name", "tag", "topic", "archive_date")
        filter_fields = {
            "discord_id": ["exact"],
            "name": ["exact", "icontains", "istartswith"],
            "tag__name": ["exact", "icontains", "istartswith"],
            "tag__slug": ["exact"],
            "tag__tag_type": ["exact"],
            "archive_date": ["gt", "lt"],
        }
        interfaces = (relay.Node,)


class ChannelQuery(ObjectType):
    channel = relay.Node.Field(ChannelType)
    channels = DjangoFilterConnectionField(ChannelType)

    def resolve_channels(root, info):
        return Channel.objects.all()


class AuthorType(DjangoObjectType):
    class Meta:
        model = Author
        fields = ("discord_id", "name")
        filter_fields = {
            "discord_id": ["exact"],
            "name": ["exact", "icontains", "istartswith"],
        }
        interfaces = (relay.Node,)


class AuthorQuery(ObjectType):
    author = relay.Node.Field(AuthorType)
    authors = DjangoFilterConnectionField(AuthorType)

    def resolve_authors(root, info):
        return Author.objects.all()


class NicknameType(DjangoObjectType):
    class Meta:
        model = Nickname
        fields = ("author", "name", "start_date", "end_date", "avatar")
        filter_fields = {
            "author": ["exact"],
            "author__discord_id": ["exact"],
            "author__name": ["exact", "icontains", "istartswith"],
            "name": ["exact", "icontains", "istartswith"],
            "start_date": ["gt", "lt"],
            "end_date": ["gt", "lt"],
        }
        interfaces = (relay.Node,)


class NicknameQuery(ObjectType):
    nickname = relay.Node.Field(NicknameType)
    nicknames = DjangoFilterConnectionField(NicknameType)

    def resolve_authors(root, info):
        return Nickname.objects.all()


class MessageType(DjangoObjectType):
    class Meta:
        model = Message
        fields = ("discord_id", "channel", "nickname", "timestamp", "raw_message")
        filter_fields = {
            "discord_id": ["exact"],
            "channel": ["exact"],
            "channel__name": ["exact", "icontains", "istartswith"],
            "channel__discord_id": ["exact"],
            "channel__name": ["exact", "icontains", "istartswith"],
            "channel__tag__name": ["exact", "icontains", "istartswith"],
            "channel__tag__slug": ["exact"],
            "channel__tag__tag_type": ["exact"],
            "channel__archive_date": ["gt", "lt"],
            "nickname": ["exact"],
            "nickname__author": ["exact"],
            "nickname__author__discord_id": ["exact"],
            "nickname__author__name": ["exact", "icontains", "istartswith"],
            "nickname__name": ["exact", "icontains", "istartswith"],
            "timestamp": ["gt", "lt"],
        }
        interfaces = (relay.Node,)


class MessageQuery(ObjectType):
    message = relay.Node.Field(MessageType)
    messages = DjangoFilterConnectionField(MessageType)

    def resolve_authors(root, info):
        return Message.objects.all()
