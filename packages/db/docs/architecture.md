# Architecture

## Purpose

`@pytholit/db` gives the repo a single database source of truth.

The package separates database concerns into three layers:

- schema definition
- Prisma CLI configuration
- runtime client usage

## Schema Layer

`prisma/schema.prisma` defines the database models used by the application.

Current high-level sections:

- auth and users
- projects
- deployments

This file is the authoritative database model definition for the repo.

## CLI Layer

`prisma.config.ts` configures Prisma CLI commands such as:

- `prisma generate`
- `prisma db push`
- `prisma migrate dev`
- `prisma migrate deploy`
- `prisma studio`

Instead of expecting a prebuilt `DATABASE_URL` in env, it builds the datasource URL from structured DB fields.

That keeps the package aligned with the repo-wide database convention.

## Runtime Layer

`src/index.ts` creates the shared Prisma client used by the API.

Key runtime behavior:

- builds the PostgreSQL URL from structured DB env fields
- uses `PrismaPg` with the generated Prisma client
- keeps a singleton client in non-production to avoid duplicate client creation during reloads
- re-exports Prisma types and generated client symbols

## Build Layer

`tsup.config.ts` builds the package in both CJS and ESM formats.

Important build detail:

- Prisma generated files are not bundled into one opaque runtime blob
- after build, the generated client is copied into `dist/generated`

That keeps Prisma’s runtime layout compatible with the package output.
