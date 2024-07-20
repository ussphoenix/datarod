FROM python:3.12-bookworm

LABEL org.opencontainers.image.title="Phoenix Archive (datrod)"
LABEL org.opencontainers.image.description="Phoenix Archive Backend Service"
LABEL org.opencontainers.image.authors="Winston Astrachan"

# Install build dependencies
RUN <<EOT
    set -eux
    pip install -U poetry
EOT

# Install app dependencies before application for layer cache
COPY pyproject.toml /app/
COPY poetry.lock /app/
RUN <<EOT
    set -eux
    cd /app
    poetry config virtualenvs.create false
    poetry install
EOT

COPY . /app
WORKDIR /app

EXPOSE 8080
CMD ["gunicorn", \
    "--bind", ":8080", \
    "--workers", "4", \
    "--threads", "4", \
    "--pid", "/var/run/gunicorn.pid", \
    "datarod.wsgi:application"]