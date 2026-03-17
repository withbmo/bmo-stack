# Migration Runbook

## Purpose

This page is the practical runbook for running Prisma migrations in local development.

It assumes:

- you are working from the repository root
- local PostgreSQL is already running and reachable
- your API database env uses the standard DB fields documented in this section

## Local migration prerequisites

Make sure your local PostgreSQL instance is running and reachable with the DB settings below.

Make sure your local API env contains:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pytholit
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_SSLMODE=disable
```

## Install dependencies

```bash
pnpm install
```

If Prisma generation fails, first confirm your Node version matches the repo requirement.

## Generate Prisma client

```bash
pnpm db:generate
```

This regenerates the Prisma client from [packages/db/prisma/schema.prisma](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/packages/db/prisma/schema.prisma).

## Create and apply a new migration locally

Use this when you changed the Prisma schema and want a new migration file:

```bash
pnpm db:migrate
```

This runs Prisma `migrate dev` through the shared workspace script.

Expected result:

- a new folder appears under `packages/db/prisma/migrations`
- the local database is updated
- the Prisma client is regenerated

## Apply existing migrations to local DB

If you only need to bring a local database up to date with migrations already committed in git, run:

```bash
pnpm --filter @pytholit/db exec prisma migrate deploy --schema prisma/schema.prisma
```

This applies existing migrations without creating a new one.

## Open Prisma Studio locally

```bash
pnpm db:studio
```

Use this to inspect the current local database contents.

## Reset local database state

If your local migration state is broken and you want a clean rebuild:

```bash
pnpm --filter @pytholit/db exec prisma migrate reset --schema prisma/schema.prisma
```

This is destructive for the local database.

Use it only when you are comfortable losing local data.

## Check migration files

List migrations:

```bash
find packages/db/prisma/migrations -maxdepth 1 -mindepth 1 -type d | sort
```

Inspect the schema:

```bash
sed -n '1,220p' packages/db/prisma/schema.prisma
```

## Recommended local workflow

1. Start your local PostgreSQL instance
2. Update `packages/db/prisma/schema.prisma`
3. Run `pnpm db:migrate`
4. Review the generated SQL migration
5. Run the API locally and verify behavior

## Common problems

### Prisma cannot connect

Check:

- PostgreSQL is running
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD` are correct
- local port `5432` is not occupied by another Postgres instance

### Prisma generate fails before migrations

Check:

- `node -v`
- repo Node requirement in [README.md](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/README.md)

### Migration created but app still fails

Check:

- Prisma client was regenerated
- the API is reading the same local DB settings you expect
- the local database actually contains the applied migration history
