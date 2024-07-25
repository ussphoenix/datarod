import datetime
from typing import Optional

from django.db import models
from django.db.models import Q
from django.utils.timezone import make_aware


class Tag(models.Model):
    """Categorization for Channels, such as server events"""

    class TagType(models.TextChoices):
        EVENTS = "events", "Events"
        QUARTERS = "quarters", "Crew Quarters"
        PHOENIXB = "phoenixb", "Phoenix B"
        OTHER = "other", "Other"

    name = models.CharField(max_length=128)
    slug = models.SlugField(max_length=64, unique=True)
    tag_type = models.CharField(max_length=64, choices=TagType, default=TagType.EVENTS)
    description = models.TextField(null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["-start_date", "name"]


class Channel(models.Model):
    """Archived channel instance"""

    discord_id = models.CharField("channel id", max_length=64, null=True, blank=True)
    name = models.CharField(max_length=100)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, null=True, blank=False)
    topic = models.TextField(null=True, blank=True)
    archive_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"#{self.name}"

    class Meta:
        ordering = ["name"]


class Author(models.Model):
    """Discord user account instance"""

    discord_id = models.CharField("author id", max_length=64, null=True, blank=True)
    name = models.CharField("discord username", max_length=64)

    def __str__(self):
        return self.name


class Nickname(models.Model):
    """Nickname of an Author at a point in time

    Since Authors (users) can change their nickname from time to time,
    this model tracks what a given Author's nickname is at a point in time
    bounded by a start and end date. A Nickname with no end date is considered
    the "current" Nickname, and when a new Nickname is created, the previous
    "current" Nickname is given an end date and the new Nickname becomes the current.
    In this way, the Nickname model behaves like a mutable stack.
    """

    author = models.ForeignKey(
        Author, on_delete=models.CASCADE, related_name="nicknames"
    )
    name = models.CharField("nickname", max_length=64)
    start_date = models.DateTimeField("nickname in use from", null=True, blank=True)
    end_date = models.DateTimeField("nickname in use to", null=True, blank=True)
    avatar = models.CharField(max_length=256, null=True, blank=True)

    def __str__(self):
        return f"{self.name} <{self.author.name}>"

    @property
    def discord_id(self) -> str:
        return self.author.discord_id or None

    @classmethod
    def current_nickname(cls, author: Author) -> "Nickname":
        """Return the "current" Nickname (start date, but no end date)"""
        return cls.objects.filter(author=author, end_date__isnull=True).first()

    @classmethod
    def nickname_for_datetime(
        cls, author: Author, timestamp: datetime.datetime
    ) -> "Nickname":
        """Return a nickname for a given timestamp (where the timestamp falls between the start and end date)"""
        if nickname := cls.objects.filter(
            start_date__gte=timestamp, end_date__lte=timestamp
        ):
            return nickname
        return cls.current_nickname(author)

    @classmethod
    def get_or_create_for_author(
        cls,
        author: Author,
        name: str,
        start_date: datetime.datetime = None,
        end_date: datetime.datetime = None,
        avatar: str = None,
    ) -> "Nickname":
        """Create a new Nickname for an Author if the name does not match the current Nickname"""
        current = cls.current_nickname(author)
        if current and current.name == name:
            return current
        return cls.create_for_author(author, name, start_date, end_date, avatar)

    @classmethod
    def create_for_author(
        cls,
        author: Author,
        name: str,
        start_date: datetime.datetime = None,
        end_date: datetime.datetime = None,
        avatar: str = None,
    ) -> "Nickname":
        """Create a new Nickname for an Author
        If an end_date is not provided, this Nickname will become the current Nickname
        If a start_date is not provided, use the current server time
        """
        current = cls.current_nickname(author)

        if not start_date:
            start_date = make_aware(datetime.datetime.now())
        new = cls(
            start_date=start_date,
            end_date=end_date,
            author=author,
            name=name,
            avatar=avatar,
        )
        new.save()

        if current and not end_date:
            # If an end date was not provided for the new nickname, assume
            # that the new nickname should become the current nickname
            current.end_date = make_aware(datetime.datetime.now())
            current.save()
        return new


class Message(models.Model):
    """Discord message instance"""

    discord_id = models.CharField("message id", max_length=64, null=True, blank=True)
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)
    nickname = models.ForeignKey(
        Nickname, null=True, blank=True, on_delete=models.SET_NULL
    )
    timestamp = models.DateTimeField(null=True, blank=True)
    raw_message = models.JSONField(null=True)

    def __str__(self):
        if message := self.raw_message.get("content"):
            return message
        return self.discord_id

    class Meta:
        ordering = ["timestamp"]
