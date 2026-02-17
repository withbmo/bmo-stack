# Local dev with Docker Compose

This repo includes a lightweight `docker-compose.dev.yml` that lets you run the minimum services needed for local development.

## Start the essentials (Postgres + Redis + env-orchestrator)

```bash
docker compose -f docker-compose.dev.yml up -d
```

Endpoints on your machine:

- Postgres: `postgresql://postgres:postgres@localhost:5432/pytholit`
- Redis: `redis://localhost:6379`
- env-orchestrator: `http://localhost:3401/health`

Example:

```bash
curl http://localhost:3401/health
```

## Start the API too (optional)

The API service is behind a compose profile so it doesn’t start by default.

```bash
docker compose -f docker-compose.dev.yml --profile api up -d --build
```

API endpoint:

- `http://localhost:3001/api/v1`

## Stop

```bash
docker compose -f docker-compose.dev.yml down
```

