# syntax=docker/dockerfile:1

ARG YARN_CACHE_FOLDER="/var/cache/yarn"


FROM node:18-alpine as deps
ARG YARN_CACHE_FOLDER

ENV YARN_CACHE_FOLDER="${YARN_CACHE_FOLDER}"


USER node
WORKDIR /build


COPY --chown="node:node" package.json .


RUN --mount=type=cache,uid=1000,gid=1000,target=node_modules         \
    --mount=type=cache,uid=1000,gid=1000,target=${YARN_CACHE_FOLDER} \
    yarn



FROM node:18-alpine as build-env
ARG YARN_CACHE_FOLDER

ENV YARN_CACHE_FOLDER="${YARN_CACHE_FOLDER}"


RUN mkdir "${YARN_CACHE_FOLDER}"         \
 && chown node:node "${YARN_CACHE_FOLDER}"


USER node
WORKDIR /app


COPY --chown="node:node" --from=deps /build/node_modules node_modules
COPY --chown="node:node"             vite.config.js      .
COPY --chown="node:node"             package.json        .


ENTRYPOINT [ "yarn" ]
CMD        [ "dev" ]



FROM build-env as dev
ARG YARN_CACHE_FOLDER


RUN --mount=type=cache,uid=1000,gid=1000,target=${YARN_CACHE_FOLDER} \
    yarn install --production=false

VOLUME [ "src" ]



FROM build-env as prod-build
ARG YARN_CACHE_FOLDER


COPY --chown="node:node" src src


RUN --mount=type=cache,uid=1000,gid=1000,target=${YARN_CACHE_FOLDER} \
    yarn install                                                     \
 && yarn build



FROM nginx:1.25.5-alpine


COPY --chown="nginx:nginx" --from=prod-build /app/dist /usr/share/nginx/html


LABEL maintainer="Alan Jean <afinegameofnil@gmail.com>"
