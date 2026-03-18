# Templates

This folder contains starter projects that agents and users can build on top of.

Each template lives in its own directory and must include a root manifest named:

- `pytholit.toml`

That filename is the standard project spec filename for Pytholit templates and user projects.

## Purpose

Templates are intended to provide:

- a valid project layout
- a valid `pytholit.toml`
- sensible starter code or placeholders
- a clean foundation for agents to extend

## Architecture contract

All templates follow the shared rules in [ARCHITECTURE.md](./ARCHITECTURE.md).

That contract keeps the templates:

- stack-native
- easy for agents to understand
- readable for human developers
- ready to grow without a rewrite

## Structure

Recommended structure:

```text
templates/
  <template-name>/
    pytholit.toml
    README.md
    ...
```

## Current templates

- `next-web`
- `vite-react-web`
- `fastify-api`
- `fastapi-api`

## Generator commands

- `pnpm templates:generate`
- `pnpm templates:generate -- --template next-web`
- `pnpm templates:validate`

## Rules

- every template must be self-describing
- every template must keep `pytholit.toml` at the template root
- the manifest should be the source of truth for buildable units, services, routes, secrets, and optional resources
- generated Docker or deployment files should be derived later from the manifest, not treated as the template's core model
- every template must expose one obvious place for routes/pages, config, shared code, and feature logic
- entrypoints should stay small and orchestration-only
