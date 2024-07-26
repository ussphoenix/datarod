# Generated by Django 5.0.7 on 2024-07-26 17:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("archive", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="author",
            name="name",
        ),
        migrations.RemoveField(
            model_name="nickname",
            name="author",
        ),
        migrations.RemoveField(
            model_name="nickname",
            name="end_date",
        ),
        migrations.RemoveField(
            model_name="nickname",
            name="start_date",
        ),
        migrations.AddField(
            model_name="nickname",
            name="authors",
            field=models.ManyToManyField(to="archive.author"),
        ),
    ]
