# Pytholit v2 - Monorepo

Modern monorepo architecture for Pytholit using Next.js + Nest.js.

## Architecture

```
pytholit-v2/
├── apps/
│   ├── web/           # Next.js 15 frontend
│   ├── api/           # Nest.js backend
│   ├── admin/         # Admin dashboard
│   └── docs/          # Documentation site
├── packages/
│   ├── contracts/     # Shared TypeScript types
│   ├── validation/    # Zod schemas & DTOs
│   ├── config/        # Shared configuration
│   ├── utils/         # Utilities
│   ├── ui/            # Design system
│   ├── api-client/    # Type-safe API client
│   └── db/            # Prisma schema & client
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

# Run tests
pnpm test
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

- [Architecture Overview](./docs/architecture.md)
- [Development Guide](./docs/development.md)
- [Deployment](./docs/deployment.md)
- [API Database Docs](./apps/api/docs/database/README.md)

## Templates

Starter projects now live under `templates/`.

Each template uses `pytholit.toml` as the standard root project spec filename.

Useful commands:

- `pnpm templates:generate`
- `pnpm templates:validate`

## License

MIT
