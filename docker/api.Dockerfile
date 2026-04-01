FROM node:22-bookworm-slim AS base

WORKDIR /app
ENV CI=true

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @pytholit/api build

EXPOSE 3001
CMD ["pnpm", "--filter", "@pytholit/api", "start:prod"]
