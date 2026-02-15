# Development

## Prerequisites

- Node.js >= 20
- pnpm >= 9

## Install

```bash
pnpm install
pnpm db:generate
pnpm db:migrate
```

## Run locally

```bash
pnpm dev
```

Or run individual apps:

```bash
pnpm --filter @pytholit/web dev
pnpm --filter @pytholit/api dev
```

## Local “environments” model (what exists today)

Even without AWS, the API supports creating “environments” as database records:

- **Create**: `POST /environments`
- **Ownership**: stored in Postgres on `environments.owner_id`, enforced by API checks
- **Start/Stop/Terminate**: currently updates `environments.config.orchestrator` status fields (no AWS provisioning yet)

See `docs/demo/user-environments.md` for the exact API-level flow.

