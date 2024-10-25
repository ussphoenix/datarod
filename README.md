# Phoenix Archive ("datarod")

Browseable Discord archive website and archive bot

## Requirements

- [docker](https://docs.docker.com/engine/install/)
- [docker compose](https://docs.docker.com/compose/install/)

## Development Quickstart

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

Once the project has started up:

- Navigate to [localhost:8080](http://localhost:8080) to view the frontend app
- Navigate to [localhost:8000/admin](http://localhost:8000/admin) to view the backend admin
- Navigate to [localhost:8000/graphql](http://localhost:8000/graphql) to view the graphql schema browser

## Installation

[Summary Installation Guide](INSTALLATION.md)

## Backend (`/backend`)

Backend service for datarod and Discord bot for archive data ingestion. [Django](https://docs.djangoproject.com/en/5.0/) + [graphene](https://docs.graphene-python.org/projects/django/en/latest/) + [discord.py](https://discordpy.readthedocs.io/en/latest).

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

## Workflow

#### Archiving Full Channels

Generally, the archive workflow might look like this:

1. Go to the archive site and create a new Tag. (e.g. "Spaceships and Shenanigans" with the Tag Type "Event")
2. Copy the slug you created (e.g. "spaceships-and-shenanigans")
3. In Discord, open a channel to be archived. Use the `/archive` slash command with the new tag to begin the archive process. (e.g. `/archive tag spaceships-and-shenanigans`)
4. Wait to receive a message from the bot indicating the archive process is complete
5. Check the archive, and then delete the channel

#### Archiving Partial Channels

It is also possible to archive _between_ two messages in a channel. To do this, you must have enabled _Developer Mode_ enabled to copy message ID's (`User Settings` > `Advanced` > `Developer Mode`)

1. Go to the archive site and create a new Tag. (e.g. "Spaceships and Shenanigans" with the Tag Type "Event")
2. Copy the slug you created (e.g. "spaceships-and-shenanigans")
3. In Discord, open a channel to be archived.
4. Find the message that is **one message older** than the first message you want to archive. Right-click and "Copy Message ID". Save this somewhere.
5. Find the message that is **one message newer** than the last message you want to archive. Right-click and "Copy Message ID". Save this somewhere.
6. Use the `/archive` command to archive the channel. Include the optional `after` and `before` parameters. (e.g. `/archive tag spaceships-and-shenanigans after 1299514391569502239 before 1299514407675756625`)
7. Wait to receive a message from the bot indicating the archive process is complete
8. Check the archive, and then delete the channel

#### Importing Old Archives

There are a pair of rough management commands to assist in importing old archives generated with [DiscordChatExporter](https://github.com/Tyrrrz/DiscordChatExporter). Since these archives are HTML files and not a more pristine archive format, the import process is subject to errors, and thus each import thread occurs in a transaction to try to preserve the integrity of the database.

There are two version of the import command, `import_legacy_html` and `import_newer_html`, as the export format from DiscordChatExporter changed during some update. If the HTML file contains the class `chatlog__message-container`, it's a "newer" format. If it does not, it is the "legacy" format.

Create a tag before importing a channel. Then:

```shell
docker compose run --rm  backend python manage.py import_legacy_html --tag TAG --channel CHANNEL --file "path/to/file.html"
```

Or:

```shell
docker compose run --rm  backend python manage.py import_newer_html --tag TAG --channel CHANNEL --file "path/to/file.html"
```

#### Backing Up

The entire archive could (and **should**) be backed up regularly:

```shell
docker compose exec mysql sh -c 'exec mysqldump --all-databases -uroot -p"$MYSQL_ROOT_PASSWORD"' > ./all-databases.sql
```
