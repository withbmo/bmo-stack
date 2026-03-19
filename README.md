# Pytholit v2 - Monorepo

Modern monorepo architecture for Pytholit using Next.js + Nest.js.

## Architecture

```text
pytholit-v2/
├── apps/
│   ├── web/               # Next.js frontend
│   ├── api/               # Nest.js backend
│   ├── ingress-router/    # Ingress/routing service
│   └── terminal-gateway/  # Terminal session gateway
├── packages/
│   ├── contracts/         # Shared TypeScript types
│   ├── db/                # Prisma schema & client
│   ├── project-spec/      # TOML project spec parser/validator/planner
│   ├── ui/                # Design system
│   └── validation/        # Zod schemas & DTOs
├── templates/             # Full starter projects with pytholit.toml
└── .devcontainer/         # Reproducible development environment
```

## Getting Started

### Prerequisites

- Node.js >= 20.19.0
- pnpm >= 9.0.0

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate

# Push the current schema into a fresh local database
pnpm --filter @pytholit/db db:push
```

### Database topology

- Local development: any local PostgreSQL instance configured through `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, and `DB_PASSWORD`
- Production API: PostgreSQL-compatible managed database, now designed to use Supabase via `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, and `DB_PASSWORD`
- Production Prisma migrations: optionally use `DB_DIRECT_HOST` when migrations should bypass the runtime host

### Development

```bash
# Start all apps in development mode
pnpm dev

# Start specific app
pnpm --filter @pytholit/web dev
pnpm --filter @pytholit/api dev

# Build all apps
pnpm build

# Run linting
pnpm lint

# Validate templates
pnpm templates:validate
```

## Key Features

- **Zero Duplication**: Shared types and validation across frontend and backend
- **Type Safety**: End-to-end TypeScript with Prisma and tRPC
- **Fast Builds**: Turborepo with intelligent caching
- **Modern Stack**: Next.js 15 + Nest.js 10 + Prisma

## Technology Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Nest.js 10, Prisma, PostgreSQL
- **Monorepo**: Turborepo, pnpm workspaces
- **Validation**: Zod, class-validator
- **State**: TanStack Query
- **Type Safety**: TypeScript 5.7

## Documentation

- [Contributing](./CONTRIBUTING.md)
- [Security](./SECURITY.md)
- [API Database Docs](./apps/api/docs/database/README.md)
- [Project Spec Docs](./packages/project-spec/docs/README.md)
- [Template Catalog](./templates/README.md)
- [Devcontainer](./.devcontainer/devcontainer.json)

## Templates

Starter projects now live under `templates/`.

Each template uses `pytholit.toml` as the standard root project spec filename.

Useful commands:

- `pnpm templates:generate`
- `pnpm templates:validate`

## License

This repository is source-available under [PolyForm Noncommercial 1.0.0](./LICENSE.md).

Commercial use is not permitted under the current license terms.
