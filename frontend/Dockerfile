################################################ First Stage: Dependencies Pack

FROM node:lts AS dependencies

LABEL org.opencontainers.image.title="Phoenix Archive (datrod)"
LABEL org.opencontainers.image.description="Phoenix Archive Frontend Service"
LABEL org.opencontainers.image.authors="Winston Astrachan"


ARG VITE_APP_MODE="production"
ENV VITE_APP_VERSION=$VITE_APP_VERSION

COPY package*.json /
RUN set -eux; npm install --include=dev
COPY . /app
WORKDIR /app
EXPOSE 8080

############################################ Second Stage: Static Asset Builder

FROM dependencies AS builder
LABEL org.opencontainers.image.description="Phoenix Archive Frontend Asset Builder"
RUN set -eux; npm run build-${VITE_APP_MODE}

############################################## Third Stage: Static Asset Server

FROM nginx:latest AS server
LABEL org.opencontainers.image.description="Phoenix Archive Frontend Service"
RUN rm -rf /usr/share/nginx/html/*
COPY docker/overlay /
COPY --from=builder /app/dist/ /usr/share/nginx/html