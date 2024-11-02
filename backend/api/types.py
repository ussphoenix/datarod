from typing import Optional

import graphene
from graphene import Mutation, ObjectType, relay
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from graphene_file_upload.scalars import Upload
from graphql_relay import from_global_id

from django.urls import reverse

from api.utils import login_required, staff_required
from archive.models import Channel, Message, Nickname, Tag


class TagType(DjangoObjectType):
    class Meta:
        model = Tag
        fields = (
            "id",
            "name",
            "slug",
            "banner",
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


class TagMutation(Mutation):
    class Input:
        id = graphene.ID()
        name = graphene.String(required=True)
        banner = Upload()
        clear_banner = graphene.Boolean()
        tag_type = graphene.String(
            required=True
        )  # This really should be a choices-derived ENUM...
        slug = graphene.String(required=True)
        description = graphene.String()
        start_date = graphene.Date()
        end_date = graphene.Date()

    # Mutation response object
    tag = graphene.Field(TagType)

    @login_required
    @staff_required
    def mutate(
        root,
        info,
        name,
        tag_type,
        slug,
        clear_banner=False,
        banner=None,
        id=None,
        description=None,
        start_date=None,
        end_date=None,
    ):
        update_fields = {
            "name": name,
            "tag_type": tag_type,
            "slug": slug,
            "description": description,
            "start_date": start_date,
            "end_date": end_date,
        }

        # Update existing tag
        if id:
            tag = Tag.objects.get(pk=from_global_id(id).id)
            for key, value in update_fields.items():
                setattr(tag, key, value)
        else:
            tag = Tag(**update_fields)

        # Update (or clear) tag banner
        if clear_banner:
            tag.banner = None
        elif banner:
            tag.banner = banner

        tag.save()
        return TagMutation(tag=tag)


class ChannelType(DjangoObjectType):
    class Meta:
        model = Channel
        fields = ("discord_id", "name", "tag", "topic", "archive_date")
        filter_fields = {
            "discord_id": ["exact"],
            "name": ["exact", "icontains", "istartswith"],
            "tag": ["exact"],
            "tag__name": ["exact", "icontains", "istartswith"],
            "tag__slug": ["exact"],
            "tag__tag_type": ["exact"],
            "archive_date": ["gt", "lt"],
        }
        interfaces = (relay.Node,)


class ChannelQuery(ObjectType):
    channel = relay.Node.Field(ChannelType)
    channels = DjangoFilterConnectionField(ChannelType)


class NicknameType(DjangoObjectType):
    discord_ids = graphene.List(graphene.String)

    @login_required
    def resolve_discord_ids(root, info, **kwargs):
        return [author.discord_id for author in root.authors.all()]

    class Meta:
        model = Nickname
        fields = ("id", "discord_ids", "name", "avatar", "color")
        filter_fields = {
            "name": ["exact", "icontains", "istartswith"],
        }
        interfaces = (relay.Node,)


class NicknameQuery(ObjectType):
    nickname = relay.Node.Field(NicknameType)
    nicknames = DjangoFilterConnectionField(NicknameType)


class NicknameMutation(Mutation):
    class Input:
        id = graphene.ID(required=True)
        name = graphene.String()
        avatar = graphene.String()
        color = graphene.String()

    nickname = graphene.Field(NicknameType)

    @login_required
    @staff_required
    def mutate(root, info, id, name=None, avatar=None):
        nickname = Nickname.objects.get(pk=from_global_id(id).id)
        if name:
            nickname.name = name
        if avatar:
            nickname.avatar = avatar
        if color:
            nickname.color = color
        nickname.save()
        return NicknameMutation(nickname=nickname)


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
            "nickname__name": ["exact", "icontains", "istartswith"],
            "timestamp": ["gt", "lt"],
        }
        interfaces = (relay.Node,)


class MessageQuery(ObjectType):
    message = relay.Node.Field(MessageType)
    messages = DjangoFilterConnectionField(MessageType)


class MeType(ObjectType):
    username = graphene.String()
    is_staff = graphene.Boolean()
    is_authenticated = graphene.Boolean()
    login_url = graphene.String()
    logout_url = graphene.String()

    def resolve_username(parent, info) -> Optional[str]:
        if info.context.user:
            return info.context.user.username
        return None

    def resolve_is_staff(parent, info) -> Optional[bool]:
        if info.context.user:
            return info.context.user.is_staff
        return None

    def resolve_is_authenticated(parent, info) -> Optional[bool]:
        if info.context.user:
            return info.context.user.is_authenticated and info.context.user.is_active
        return None

    def resolve_login_url(parent, info) -> str:
        return info.context.build_absolute_uri(
            reverse("social:begin", args=["discord"])
        )

    def resolve_logout_url(parent, info) -> str:
        return info.context.build_absolute_uri(reverse("logout"))


class MeQuery(ObjectType):
    me = graphene.Field(MeType)

    def resolve_me(root, info, **kwargs):
        """`Me` is constructed from info.context.user, so there
        is nothing we need to resolve here
        """
        return {}
