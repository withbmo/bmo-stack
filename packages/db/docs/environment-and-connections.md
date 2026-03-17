# Environment and Connection Resolution

## Source of truth

`@pytholit/db` does not maintain a package-local env file anymore.

It expects the caller environment to provide the standard DB fields.

## Runtime variables

Used by `src/index.ts`:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_SSLMODE`

Runtime fallback behavior:

- in production, missing required DB fields throw
- outside production, the package falls back to a local default:
  - host `localhost`
  - port `5432`
  - db `pytholit`
  - user `postgres`
  - password `postgres`
  - sslmode `disable`

## Prisma CLI variables

Used by `prisma.config.ts`:

- `DB_DIRECT_HOST`
- `DB_DIRECT_PORT`
- otherwise falls back to the standard runtime DB fields

This allows Prisma CLI commands to use a different host for migrations when needed, without changing runtime application settings.

## Why `DATABASE_URL` is not the convention here

Prisma itself still works with a connection URL internally, but this repo does not ask humans to hand-manage that URL.

Instead:

- the repo stores structured DB fields
- `@pytholit/db` builds the URL internally for Prisma runtime and CLI usage

This keeps the configuration contract consistent across local development, API runtime, and infrastructure wiring.
