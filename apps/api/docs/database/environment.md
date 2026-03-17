# Database Environment Variables

## Standard runtime variables

These are the primary database variables used by the API and the shared Prisma package.

### `DB_HOST`

- PostgreSQL host for normal application runtime
- local development: usually `localhost`
- production with Supabase: runtime or pooler host

### `DB_PORT`

- PostgreSQL port for normal application runtime
- local development: usually `5432`
- Supabase pooled runtime ports may differ from direct Postgres ports

### `DB_NAME`

- PostgreSQL database name
- local development: `pytholit`
- production with Supabase: commonly `postgres` unless you intentionally use a different database

### `DB_USERNAME`

- PostgreSQL username
- this is the only supported username variable
- `DB_USER` is no longer part of the intended contract

### `DB_PASSWORD`

- PostgreSQL password
- should be injected from a secret source in production

### `DB_SSLMODE`

- SSL mode appended to the internally built Prisma connection string
- local development: `disable`
- production with Supabase: usually `require`

## Optional migration-only variables

### `DB_DIRECT_HOST`

- optional
- if set, Prisma CLI uses this host instead of `DB_HOST`
- intended for cases where migrations should bypass the runtime host or pooler

### `DB_DIRECT_PORT`

- optional
- if set together with `DB_DIRECT_HOST`, Prisma CLI uses it for direct migrations

## Example: local development

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pytholit
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_SSLMODE=disable
DB_DIRECT_HOST=
DB_DIRECT_PORT=
```

## Example: Supabase production runtime

```env
DB_HOST=aws-0-us-east-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USERNAME=postgres.xxxxxxxx
DB_PASSWORD=your-password
DB_SSLMODE=require
```

## Example: Supabase production with direct migration host

```env
DB_HOST=aws-0-us-east-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USERNAME=postgres.xxxxxxxx
DB_PASSWORD=your-password
DB_SSLMODE=require
DB_DIRECT_HOST=db.xxxxxxxx.supabase.co
DB_DIRECT_PORT=5432
```

## Resolution rules

### Application runtime

Runtime code uses:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_SSLMODE`

### Prisma CLI

Prisma CLI uses:

- `DB_DIRECT_HOST` and `DB_DIRECT_PORT` when they are set
- otherwise it falls back to `DB_HOST` and `DB_PORT`

This allows migrations to use a more appropriate host without changing the application runtime host.
