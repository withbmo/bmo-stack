# Fastify API

Lightweight TypeScript Fastify API starter for Pytholit.

## Stack

- Fastify
- TypeScript
- npm

## Init commands

This template is bootstrapped with command-only initialization:

- `npm init -y`
- `npm install fastify@latest`
- `npm install --save-dev typescript@latest tsx@latest @types/node@latest`
- `npm install --save-dev eslint@latest @eslint/js@latest typescript-eslint@latest globals@latest`
- `npx tsc --init ...`

## Pytholit finalization

After initialization, Pytholit:

- keeps `src/index.ts` as a tiny runtime entrypoint
- composes the server in `src/app.ts`
- splits HTTP routes into `src/routes`
- keeps config in `src/config` and business logic in `src/services`
- adds `pytholit.toml`

## Commands

- `npm install`
- `npm run dev`
- `npm run check`
- `npm run build`
- `npm run start`

## Project structure

- `src/index.ts`: runtime entrypoint only
- `src/app.ts`: Fastify app composition
- `src/routes`: HTTP route registration
- `src/config`: environment parsing
- `src/services`: business logic
- `src/lib`: shared helpers

Add transport concerns in `src/routes`, but keep business logic in `src/services`.

## Manifest

`pytholit.toml` is the source of truth for runtime, build, and routing behavior.

See [../ARCHITECTURE.md](../ARCHITECTURE.md) for the shared template contract.
