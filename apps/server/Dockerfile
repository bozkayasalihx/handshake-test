
FROM node:alpine AS builder
RUN apk update
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=server --docker

FROM node:alpine AS installer
RUN apk update
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install


COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN yarn turbo run build --filter=server...

FROM node:alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs

ARG NODE_ENV="production"
ARG SERVER_PORT=9000
ARG ACCESS_TOKEN_SECRET_KEY="659bdc64025fd54cdf0c2e9ae059f5d510a0df49"
ARG REFRESH_TOKEN_SECRET_KEY="d0109db9329bc7c9ad59e4d648466983a85f379b"
ARG DATABASE="prod_db"
ARG DB_HOST="10.2.0.3"
ARG POSTGRES_USER="postgres"
ARG POSTGRES_PASSWORD="G1ZF6oO5AMI1sEiua3rqtXdL4shQj5pq"
ARG PG_PORT=5432

ENV NODE_ENV=${NODE_ENV}
ENV SERVER_PORT=${SERVER_PORT}
ENV ACCESS_TOKEN_SECRET_KEY=${ACCESS_TOKEN_SECRET_KEY}
ENV REFRESH_TOKEN_SECRET_KEY=${REFRESH_TOKEN_SECRET_KEY}
ENV DATABASE=${DATABASE}
ENV DB_HOST=${DB_HOST}
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV PG_PORT=${PG_PORT}

COPY --from=installer /app .

CMD node apps/server/dist/app.js
