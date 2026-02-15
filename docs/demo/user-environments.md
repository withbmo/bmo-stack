# User environments — lifecycle & assignment

This documents what happens when a user creates an environment in the product, and how it’s associated with that user.

## Data model (Postgres)

Prisma schema: `packages/db/prisma/schema.prisma`

The primary table is `environments`:

- **`id`**: UUID
- **`owner_id`**: FK to `users.id` (ownership / assignment)
- **`name`**: unique per owner (`@@unique([ownerId, name])`)
- **`display_name`**
- **`execution_mode`**: `managed | byo_aws`
- **`region`**: defaults to `us-east-1`
- **`visibility`**: `public | private`
- **`config`**: JSONB-like blob (stores access mode + orchestrator status/details)

### Ownership rules (assignment)

The environment is “assigned” to a user purely by `owner_id`.

The API enforces ownership on read/write using checks like:

- load env by ID
- if `environment.ownerId !== userId` → reject with `403`

## API endpoints (NestJS)

Controller: `apps/api/src/environments/environments.controller.ts`

- `GET /environments`: list environments for current user
- `POST /environments`: create a new environment (record only)
- `GET /environments/:id`: get one environment (ownership enforced)
- `PATCH /environments/:id`: update environment metadata/config (ownership enforced)
- `POST /environments/:id/start`: request “start” (currently status update only)
- `POST /environments/:id/stop`: request “stop” (currently status update only)
- `POST /environments/:id/terminate`: request “terminate” (currently status update only)
- `GET /environments/:id/status`: returns orchestrator status fields from `config`
- `POST /environments/:id/proxy/session`: issues a proxy JWT (for ingress-router)
- `GET /environments/:id/services`: lists service routes for this env (defaults to `/svc/app/`)
- `PATCH /environments/:id/access-mode`: `site_only | api_key_enabled`
- `POST /environments/:id/prod-api-key/rotate`: issues a new prod API key (feature-flagged)
- `POST /environments/:id/activity`: updates `config.lastActivityAt`
- `POST /environments/:id/terminal/session`: issues a terminal JWT + WS URL

Service implementation: `apps/api/src/environments/environments.service.ts`

## What “Create environment” does today

`POST /environments` currently:

1) Validates uniqueness: `(ownerId, name)` must be unique
2) Inserts a row in Postgres
3) Seeds `config` with:
   - `access.mode = "site_only"`
   - `orchestrator.status = "unknown"`
   - `orchestrator.message = "Not provisioned yet"`

**It does not** (yet) call the orchestrator service to provision an EC2 instance.

## Proxy session token (for env HTTP routing)

API endpoint: `POST /environments/:id/proxy/session`

The API issues a JWT with claims like:

- `typ: "proxy_session"`
- `sub: <userId>`
- `envId: <environmentId>`
- `serviceKey: "*" | "<service>"`

This token is intended to be presented to `ingress-router` (see `docs/demo/routing.md`).

## Terminal session token (for WebSocket terminal)

API endpoint: `POST /environments/:id/terminal/session`

The API issues a JWT with claims like:

- `typ: "terminal_session"`
- `sub: <userId>`
- `envId: <environmentId>`
- `nonce: <random>`

It returns:

- `token`
- `expiresAt`
- `wsUrl` (defaults to `wss://terminal.pytholit.dev/ws` unless `TERMINAL_GATEWAY_WS_URL` is set)

The nonce is also appended to `config.access.issuedTerminalNonces` in Postgres (last ~20 are retained).

