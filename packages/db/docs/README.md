# Database Package

`@pytholit/db` is the shared database package for the repo.

It owns:

- the Prisma schema
- Prisma client generation output
- the shared Prisma client runtime used by the API
- Prisma CLI configuration for local development and deployment workflows
- small database utilities exported to other packages

It does not own:

- API-specific service logic
- request validation
- app-level environment loading
- infrastructure provisioning

## Contents

- [Architecture](./architecture.md)
- [Environment and Connection Resolution](./environment-and-connections.md)
- [Development Workflow](./development-workflow.md)
- [Public Exports](./public-exports.md)

## Primary Files

- `package.json`
- `src/index.ts`
- `src/utils.ts`
- `prisma/schema.prisma`
- `prisma.config.ts`
- `prisma/seed.ts`
- `tsup.config.ts`

## Current Design

The package is built around one schema and one shared Prisma client:

- `prisma/schema.prisma` defines the database structure
- `prisma generate` writes the generated client into `src/generated`
- `src/index.ts` creates the shared runtime Prisma client using `@prisma/adapter-pg`
- `prisma.config.ts` builds the Prisma CLI datasource URL from the repo DB field contract

## Local Development Rule

This package no longer has its own `.env` file.

Database settings come from the shared repo/app environment contract:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_SSLMODE`
- optional `DB_DIRECT_HOST`
- optional `DB_DIRECT_PORT`

## Fresh Start Note

The migration history was intentionally reset.

At the moment, the recommended local bootstrap path is:

```bash
pnpm db:generate
pnpm --filter @pytholit/db db:push
```

That applies the current schema directly to a fresh local PostgreSQL database without relying on old tracked migrations.
