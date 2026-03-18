# Vite React Web

Lean React SPA starter template for Pytholit.

## Stack

- Vite
- React 19
- TypeScript
- pnpm

## Init command

`pnpm create vite <dir> --template react-ts --no-interactive`

## Pytholit finalization

After initialization, Pytholit:

- adds a stack-native source layout that separates app composition from features
- adds a typed env module under `src/config`
- replaces the default demo UI with a small app shell backed by feature modules
- adds `pytholit.toml`

## Commands

- `pnpm install`
- `pnpm dev`
- `pnpm run check`
- `pnpm build`

## Project structure

- `src/app`: root app composition
- `src/features`: feature areas and content
- `src/components`: reusable UI primitives
- `src/config`: environment parsing and typed runtime config
- `src/lib`: shared helpers

Add app-level composition in `src/app`, but keep reusable logic in `src/features` and `src/components`.

## Manifest

`pytholit.toml` is the source of truth for what this template builds and serves.

See [../ARCHITECTURE.md](../ARCHITECTURE.md) for the shared template contract.
