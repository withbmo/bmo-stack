# Development Workflow

## Install and generate

From the repo root:

```bash
pnpm install
pnpm db:generate
```

## Fresh local database bootstrap

After the migration reset, the clean local path is:

```bash
pnpm --filter @pytholit/db db:push
```

Use this when you want the current Prisma schema applied directly to a fresh local database.

## Ongoing schema changes

When you change `prisma/schema.prisma`:

1. update the schema
2. regenerate the client if needed
3. apply the schema to your local database
4. verify API behavior against the updated structure

Current practical commands:

```bash
pnpm db:generate
pnpm --filter @pytholit/db db:push
pnpm db:studio
```

## Package scripts

Available scripts in `packages/db/package.json`:

- `db:generate`
- `db:push`
- `db:migrate`
- `db:migrate:deploy`
- `db:studio`
- `db:seed`

## Important note on migrations

The tracked migration SQL history was intentionally cleared during the database reset.

That means:

- `db:push` is the current clean-start workflow
- future migration history should be created from the new schema baseline, not from the removed old SQL chain

## Seed file

`prisma/seed.ts` is the seed entry configured in `prisma.config.ts`.

Use:

```bash
pnpm --filter @pytholit/db db:seed
```

only when the local database is already reachable with the DB field contract.
