import datetime
from typing import Optional

from django.db import models
from django.db.models import Q
from django.utils.timezone import make_aware

from utils.models import make_upload_path


class Tag(models.Model):
    """Categorization for Channels, such as server events"""

    class TagType(models.TextChoices):
        EVENTS = "events", "Events"
        QUARTERS = "quarters", "Crew Quarters"
        PHOENIXB = "phoenixb", "Phoenix B"
        SHORE = "shore", "Shore Leaves"
        STARFLEET = "starfleet", "Starfleet Command"
        OTHER = "other", "Other"

    name = models.CharField(max_length=128)
    slug = models.SlugField(max_length=64, unique=True)
    banner = models.ImageField(
        upload_to=make_upload_path("banners"), null=True, blank=True
    )
    tag_type = models.CharField(max_length=64, choices=TagType, default=TagType.EVENTS)
    description = models.TextField(null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["-start_date", "name"]

    def save(self, *args, **kwargs):
        """Override save method in order to:

        - Delete old banner image when banner file changes
        """
        if self.pk:
            old_tag = Tag.objects.get(pk=self.pk)
            if old_tag.banner.name != self.banner.name:
                old_tag.banner.delete(save=False)
        super(Tag, self).save(*args, **kwargs)


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

    def __str__(self):
        return self.discord_id


class Nickname(models.Model):
    """Nickname of an Author at a point in time

    Since Authors (users) can change their nickname from time to time,
    this model tracks what a given Author's nickname is at a point in time.
    And further, a Nickname could be used by more than one Author
    (in the case of bot users) so authors is a many to many relationship
    as Authors can have many Nicknames but Nicknames can be used by many Authors
    """

    authors = models.ManyToManyField(Author)
    name = models.CharField("nickname", max_length=96)
    avatar = models.CharField(max_length=256, null=True, blank=True)
    color = models.CharField("hex color code", max_length=6, null=True, blank=True)

    def __str__(self):
        return self.name

    def add_author(self, discord_id: str):
        """Get or create an Author by discord id and add to this Nickname"""
        author, _created = Author.objects.get_or_create(discord_id=discord_id)
        self.authors.add(author)

    @property
    def last_author(self):
        """Return the last Author that used this Nickname"""
        return self.authors.last()

    @classmethod
    def get_or_create_with_author(
        cls,
        name: str,
        discord_id: str,
        avatar: str = None,
    ) -> "Nickname":
        """Create a new Nickname if one does not exist,
        and create a new Author if one does not exist"""
        nickname, _ = cls.objects.get_or_create(name=name)
        nickname.avatar = avatar
        nickname.add_author(discord_id)
        nickname.save()
        return nickname


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
