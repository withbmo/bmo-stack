# Next Web

Production-ready Next.js starter template for Pytholit.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- pnpm

## Init command

`npx create-next-app@latest <dir> --ts --eslint --tailwind --app --src-dir --use-pnpm --skip-install --disable-git --yes --empty`

## Pytholit finalization

After initialization, Pytholit:

- adds a stack-native source layout that is easy for humans and agents to extend
- keeps route files small and moves product content into features
- adds a typed env module under `src/config`
- adds `pytholit.toml`
- removes generator artifacts that do not belong in a standalone template

## Commands

- `pnpm install`
- `pnpm dev`
- `pnpm run check`
- `pnpm build`
- `pnpm start -- --hostname 0.0.0.0 --port 3000`

## Project structure

- `src/app`: route surfaces and Next.js framework files only
- `src/features`: product-facing feature content and sections
- `src/components`: reusable UI primitives
- `src/config`: environment parsing and typed runtime config
- `src/lib`: shared framework-light helpers

Add new pages in `src/app`, but keep real feature logic in `src/features`.

## Manifest

`pytholit.toml` is the source of truth for what this template builds and runs.

See [../ARCHITECTURE.md](../ARCHITECTURE.md) for the shared template contract.
