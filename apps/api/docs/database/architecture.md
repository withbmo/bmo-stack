# Database Architecture

## Overview

The database layer is split across two parts:

- `packages/db`
  owns the Prisma client, schema, migrations, and database connection building
- `apps/api`
  consumes the shared Prisma client and exposes it through Nest services

This keeps database access logic centralized while letting the API use a clean dependency-injection boundary.

## Main components

### `packages/db/src/index.ts`

This file is the runtime entry point for Prisma.

Responsibilities:

- reads database environment variables
- builds a PostgreSQL connection string internally
- creates the shared Prisma client instance
- enables a singleton in non-production environments

The app does not need to hand-build a `DATABASE_URL` anymore. It provides structured fields like `DB_HOST` and `DB_USERNAME`, and the DB package turns those into the connection string Prisma needs.

### `packages/db/prisma.config.ts`

This file controls Prisma CLI behavior.

Responsibilities:

- resolves the datasource used by Prisma commands
- prefers `DB_DIRECT_HOST` and `DB_DIRECT_PORT` when present
- falls back to the main runtime host when no direct migration host is configured

This is important because production application traffic and production migrations do not always need to hit the same host.

### `apps/api/src/database/prisma.service.ts`

This is the Nest wrapper around the shared Prisma client.

Responsibilities:

- connects Prisma on module startup
- disconnects Prisma on shutdown
- exposes the transaction-aware client through `PrismaTxService`

### `apps/api/src/auth/better-auth.config.ts`

Better Auth has its own PostgreSQL usage and therefore must resolve database settings too.

To stay consistent with the rest of the application, it uses the same environment contract as the shared Prisma package:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_SSLMODE`

## Runtime model

### Local development

In local development:

- Docker runs PostgreSQL
- the API connects to it using local development defaults
- Prisma commands target the same local database by default

### Production

In production:

- the API is expected to use Supabase PostgreSQL settings
- Prisma runtime uses the main host fields
- Prisma migrations can optionally use a direct host if one is configured and reachable

## Why structured DB fields were chosen

The codebase now uses structured environment fields instead of asking application code to receive raw connection URLs directly.

Benefits:

- easier to understand and review
- less copy-paste of long connection URLs
- clearer separation between runtime host and optional migration-only direct host
- easier Terraform secret modeling
