from django.db import models


class Tag(models.Model):
    """Categorization for DiscordChannels, such as server events"""

    class TagType(models.TextChoices):
        EVENT = "event", "Event"
        QUARTERS = "quarters", "Crew Quarters"
        OTHER = "other", "Other"

    name = models.CharField(max_length=128)
    slug = models.SlugField(max_length=64, unique=True)
    tag_type = models.CharField(max_length=64, choices=TagType, default=TagType.EVENT)
    description = models.TextField(null=True, blank=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name


class DiscordChannel(models.Model):
    """Archived channel instance"""

    discord_id = models.CharField("channel id", max_length=64, unique=True)
    name = models.CharField(max_length=100)
    tag = models.ForeignKey(Tag, on_delete=models.SET_NULL, null=True, blank=False)
    topic = models.TextField(null=True, blank=True)
    archive_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"#{self.name}"


class DiscordAuthor(models.Model):
    """Discord user account instance"""

    discord_id = models.CharField("author id", max_length=64, unique=True)

    def __str__(self):
        if self.identities:
            return self.identities.first().name
        return self.discord_id


class Identity(models.Model):
    """A representation of a DiscordAuthor within a given range of time
    It is assumed in the archive that a single user account may represent a different
    character at a different time, so an Identity accounts for this
    """

    discord_author = models.ForeignKey(
        DiscordAuthor, on_delete=models.CASCADE, related_name="identities"
    )
    name = models.CharField(max_length=128)
    start_date = models.DateTimeField("name in use from", null=True, blank=True)
    end_date = models.DateTimeField("name in use to", null=True, blank=True)
    profile_picture = models.CharField(max_length=128, null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "identities"


class DiscordMessage(models.Model):
    """Discord message instance"""

    discord_id = models.CharField("message id", max_length=64, unique=True)
    channel = models.ForeignKey(DiscordChannel, on_delete=models.CASCADE)
    author = models.ForeignKey(
        DiscordAuthor, null=True, blank=True, on_delete=models.SET_NULL
    )
    timestamp = models.DateTimeField(null=True, blank=True)
    raw_message = models.JSONField(null=True)

    def __str__(self):
        if message := self.raw_message.get("content"):
            return message
        return self.discord_id

    class Meta:
        ordering = ["timestamp"]
