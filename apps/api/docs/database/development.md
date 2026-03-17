# Development Workflow

## Local database

Local development uses a PostgreSQL instance that matches the standard DB env contract.

Relevant local values:

- host: `localhost`
- port: `5432`
- database: `pytholit`
- username: `postgres`
- password: `postgres`
- sslmode: `disable`

## Example local API env

The API example file is [apps/api/.env.example](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/apps/api/.env.example).

The database section should look like:

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

## Prisma commands

From the workspace root:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:studio
```

These use the shared Prisma config in `packages/db`.

## How Prisma resolves the local DB

### Runtime

At runtime, [packages/db/src/index.ts](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/packages/db/src/index.ts) builds the PostgreSQL connection from the standard DB fields.

### CLI

For Prisma CLI commands, [packages/db/prisma.config.ts](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/packages/db/prisma.config.ts) uses the same local values unless a direct host is explicitly configured.

## Common development expectations

- no Supabase dependency is required for local development
- no direct migration host is needed locally
- local development should be able to run against any local PostgreSQL instance that matches the env contract
