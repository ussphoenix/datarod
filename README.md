# Phoenix Archive ("datarod")

Browseable Discord archive website and archive bot

## Requirements

- [docker](https://docs.docker.com/engine/install/)
- [docker compose](https://docs.docker.com/compose/install/)

## Quickstart

Run the whole project:

```shell
docker compose build

# Optional: keep database and proxy running in the background
docker compose up -d mysql redis twilight

# Run once: apply migrations and create a superuser
docker compose run --rm  backend python manage.py migrate
docker compose run --rm  backend python manage.py createsuperuser

docker compose up
```

Navigate to [localhost:8000/admin](http://localhost:8000/admin) to view the backend admin
Navigate to [localhost:8000/graphql](http://localhost:8000/graphql) to view the graphql schema browser

## Backend (`/backend`)

Backend service for datarod and Discord bot for archive data ingestion. [Django](https://docs.djangoproject.com/en/5.0/) + [strawberry](https://github.com/strawberry-graphql/strawberry-django) + [discord.py](https://discordpy.readthedocs.io/en/latest).

### Apps

- `api` - GraphQL API
- `archive` - Discord channel archive data models
- `bot`- Discord archive bot and event handlers

### Components

- `mysql` - Database
- `redis` - Memory store
- `django-rq` - Async task queue
- `twilight-rs` - HTTP reverse proxy for Discord's API to handle rate limiting

## Frontend (`/frontend`)

Frontend service for the Phoenix archive. React + Typescript + Vite.

## Application Concepts

Messages are associated with Channels. Channels are associated with Tags, which in turn have a Tag Type. The Tag Type could be something like "Event" or "Crew Quarters".

### Workflow

Generally, the archive workflow might look like this:

1. Go to the archive site and create a new Tag. (e.g. "Spaceships and Shenanigans" with the Tag Type "Event")
2. Copy the resulting tag (e.g. "spaceships-and-shenanigans")
3. In Discord, open a channel to be archived. Use the `/archive` slash command with the new tag to begin the archive process. (e.g. `/archive spaceships-and-shenanigans`)
4. Wait to receive a message from the bot indicating the archive process is complete
5. Check the archive, and then delete the channel

Reset everything:

```
from django.core.cache import cache
from archive.models import Channel, Author
Channel.objects.all().delete()
Author.objects.all().delete()
cache.clear()
```
