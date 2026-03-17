# Production and Supabase

## Overview

Production is intended to use Supabase as the primary PostgreSQL provider.

The application still talks to PostgreSQL through Prisma. Supabase is the managed database provider, not a replacement for the ORM layer in this codebase.

## Recommended production model

### Runtime host

Use the Supabase runtime or pooler host for:

- `DB_HOST`
- `DB_PORT`

This host is what the running API should use for normal database traffic.

### Direct migration host

If Prisma migrations should bypass the runtime host or pooler, provide:

- `DB_DIRECT_HOST`
- `DB_DIRECT_PORT`

If you do not need that split, leave them unset and migrations will use the same host as the application.

## Required runtime fields

Minimum production contract:

```env
DB_HOST=<supabase runtime host>
DB_PORT=<supabase runtime port>
DB_NAME=postgres
DB_USERNAME=<supabase username>
DB_PASSWORD=<supabase password>
DB_SSLMODE=require
```

Optional direct migration override:

```env
DB_DIRECT_HOST=<supabase direct host>
DB_DIRECT_PORT=5432
```

## What Terraform stores

The new production stack in [infra/prod](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/infra/prod) creates AWS Secrets Manager placeholders for:

- runtime DB settings
- optional direct migration host settings

Expected runtime secret shape:

```json
{
  "host": "aws-0-us-east-1.pooler.supabase.com",
  "port": "6543",
  "dbname": "postgres",
  "username": "postgres.xxxxxxxx",
  "password": "your-password",
  "sslmode": "require"
}
```

Expected direct migration secret shape:

```json
{
  "host": "db.xxxxxxxx.supabase.co",
  "port": "5432"
}
```

## Operational guidance

- keep the runtime and direct migration host separate only when there is a real operational reason
- if the direct host is not reachable from your production environment, do not force it
- keep `DB_PASSWORD` in a secret manager, never in committed env files
- keep `DB_SSLMODE=require` for Supabase production connections
