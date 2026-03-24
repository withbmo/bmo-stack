# Boundary and Ownership

## What belongs in `@pytholit/contracts`

Put a type in this package when all of the following are true:

- it describes a real API response shape or shared domain shape
- at least two packages benefit from importing the same definition
- the type should stay stable across application boundaries

Examples in the current package:

- `User`
- `Project`
- `DeployJob`
- `PasswordStrengthResponse`
- OAuth helper response types returned by the API

## What does not belong here

Do not put these in `@pytholit/contracts`:

- Nest DTOs
- Zod or class-validator schemas
- request parsing helpers
- env/config defaults
- frontend-only state shapes
- UI component props used by only one app
- browser storage keys
- auth session-store helpers

Those belong in:

- `apps/api` for server-only runtime and controller concerns
- `packages/validation` for validation schemas and DTO support
- `apps/web` for UI/view-model state and client-only helpers

## Ownership model

`apps/api` owns:

- the actual runtime implementation
- DTOs and validation
- endpoint behavior
- controller/service-specific internal types

`@pytholit/contracts` owns:

- the shared shape consumers agree on after the API responds
- stable runtime status constants reused across package boundaries

`apps/web` owns:

- derived view models
- route-specific state
- local auth flow helper types
- presentation-only data shaping

## Practical decision rule

Before adding a new contract, ask:

1. Is this an API/output shape, not an input-validation concern?
2. Will more than one package import it?
3. Would duplication create drift risk?

If the answer is yes to all three, it is a good candidate for this package.

If not, keep it local.
