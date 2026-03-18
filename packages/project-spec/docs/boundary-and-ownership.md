# Boundary and Ownership

## What belongs in `@pytholit/project-spec`

This package owns:

- the durable project manifest domain model
- TOML parsing
- schema defaults
- cross-reference validation
- planning for build/runtime/routing
- adapter interfaces for downstream compilers

## What does not belong here

Do not put these in this package:

- Nest DTOs
- API controllers
- Prisma persistence models
- Docker-specific generation logic
- ECS-specific deployment logic
- Kubernetes-specific manifest rendering
- editor-only UI metadata
- wizard-only form definitions

Those concerns belong in adapters or application packages.

## Ownership split with the rest of the repo

`apps/api` owns:

- project CRUD
- deploy-job orchestration
- wizard APIs
- authenticated runtime behavior

`apps/web` owns:

- editor and dashboard UX
- wizard form state
- project creation flow presentation

`infra/*` owns:

- concrete environment provisioning
- cloud-specific deployment resources

`@pytholit/project-spec` owns:

- the durable description of project topology and requirements
- the normalized planning model consumed by future deployment adapters
