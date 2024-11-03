# Generated by Django 5.1.2 on 2024-10-26 23:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("archive", "0004_alter_tag_tag_type"),
    ]

    operations = [
        migrations.AddField(
            model_name="nickname",
            name="color",
            field=models.CharField(
                blank=True, max_length=6, null=True, verbose_name="hex color code"
            ),
        ),
    ]