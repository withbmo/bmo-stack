# Database Documentation

This section documents the database setup used by the API and the shared Prisma package.

The current design is:

- local development uses a PostgreSQL instance you manage outside the repo
- application data access goes through Prisma
- production is intended to use Supabase as the primary PostgreSQL provider
- production migrations can optionally use a direct host when needed

## Contents

- [Architecture](./architecture.md)
- [Environment Variables](./environment.md)
- [Development Workflow](./development.md)
- [Migration Runbook](./migration-runbook.md)
- [Production and Supabase](./production-supabase.md)
- [Infra Reference](./infra-reference.md)

## Scope

These docs cover:

- how the API resolves database configuration
- how Prisma runtime and Prisma CLI use database settings
- how local development maps to the database contract
- how Supabase production settings should be represented
- how Terraform stores the production database contract

## Primary code references

- [packages/db/src/index.ts](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/packages/db/src/index.ts)
- [packages/db/prisma.config.ts](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/packages/db/prisma.config.ts)
- [packages/db/prisma/schema.prisma](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/packages/db/prisma/schema.prisma)
- [apps/api/src/database/prisma.service.ts](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/apps/api/src/database/prisma.service.ts)
- [apps/api/src/auth/better-auth.config.ts](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/apps/api/src/auth/better-auth.config.ts)
- [infra/prod](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/infra/prod)
