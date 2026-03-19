# Contributing

Thanks for contributing to Pytholit.

This repository is intended to stay readable, durable, and easy for both human developers and agents to extend safely.

## Before you start

- Read [README.md](./README.md)
- Read the template architecture docs in [templates/ARCHITECTURE.md](./templates/ARCHITECTURE.md) if you are working on starter projects
- Treat `pytholit.toml` as the source of truth for project/runtime intent

## Local development

Recommended options:

- Use the devcontainer in [/.devcontainer](./.devcontainer)
- Or use a local environment with:
  - Node.js `^20.19.0 || ^22.12.0 || >=24.0.0`
  - pnpm `>=9`
  - Docker for local backing services when needed

Typical setup:

```bash
pnpm install
pnpm db:generate
pnpm --filter @pytholit/db db:push
```

Useful commands:

```bash
pnpm dev
pnpm build
pnpm lint
pnpm type-check
pnpm templates:validate
```

## Contribution rules

- Keep changes focused
- Prefer explicit naming over clever abstractions
- Do not couple core project-spec logic to Docker, Kubernetes, or one cloud provider
- Keep artifacts, services, and routes separate in the domain model
- Keep entrypoints small and orchestration-only
- Add or update docs when behavior or architecture changes
- Add or update examples when the project spec changes

## Code quality

Before opening a change, run the checks that apply to your work.

Minimum expectation for most changes:

```bash
pnpm lint
pnpm type-check
pnpm build
```

For template work:

```bash
pnpm templates:validate
```

## Pull requests

- Explain the problem and the approach clearly
- Call out any migrations, follow-up work, or breaking changes
- Include screenshots for UI changes when helpful
- Keep PRs small enough to review safely

## Security

If you discover a security issue, do not open a public issue with exploit details.

Follow the guidance in [SECURITY.md](./SECURITY.md).
