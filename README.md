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

- Node.js >= 20.0.0
- pnpm >= 9.0.0

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate
```

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

## License

MIT
