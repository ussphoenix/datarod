FROM python:3.13-trixie

LABEL org.opencontainers.image.title="Phoenix Archive (datrod)"
LABEL org.opencontainers.image.description="Phoenix Archive Backend Service"
LABEL org.opencontainers.image.authors="Winston Astrachan"

ENV PYTHONUNBUFFERED=1 \
    UV_PROJECT_ENVIRONMENT="/usr/local" \
    UV_NO_MANAGED_PYTHON="1"

# Install build dependencies
RUN <<EOT
    set -eux
    pip install -U uv
EOT

# Install app dependencies before application for layer cache
COPY pyproject.toml /app/
COPY uv.lock /app/
RUN <<EOT
    set -eux
    cd /app
    uv sync --locked
EOT

COPY . /app
WORKDIR /app

# Prepare staticfiles
RUN <<EOT
    set -eux
    cd /app
    python manage.py collectstatic
EOT

EXPOSE 8080
CMD ["gunicorn", \
    "--bind", ":8080", \
    "--workers", "4", \
    "--threads", "4", \
    "--pid", "/var/run/gunicorn.pid", \
    "datarod.wsgi:application"]
