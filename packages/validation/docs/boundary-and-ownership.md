# Boundary and Ownership

## Purpose

`@pytholit/validation` exists to hold validation rules that must stay consistent across application boundaries.

The package is intentionally small. It is meant for shared primitives, not full request modeling.

## What belongs here

- constants that define shared validation limits or regex rules
- pure helper functions that normalize or validate shared values
- password-strength logic that needs to behave the same way wherever it is called

## What stays in `apps/api`

- Nest request DTOs
- endpoint-specific validation classes
- controller and service input modeling
- validation that only matters to backend request handling

Examples in the current codebase:

- project DTOs live in `apps/api/src/projects/dto`
- deploy-job DTOs live in `apps/api/src/deploy-jobs/dto`

## What stays in `apps/web`

- form state
- UI-only validation messaging
- view-model shaping
- client-specific interaction rules that do not define a backend contract

## Current ownership model

### Shared package

- `AUTH_CONSTANTS`
- `PROJECT_CONSTANTS`
- `normalizeEmailOrNull`
- `validatePasswordStrength`
- `getPasswordStrength`
- `zxcvbn` re-export

### API

- request DTO classes
- route-specific validation plumbing
- auth and project flows that consume the shared helpers

### Web

- auth form hooks
- onboarding page validation logic
- any client-side UX that reads the shared constants

## Design principle

If a rule must match between API and web, it belongs here.

If a type or validator only exists because Nest or a specific route needs it, it belongs in `apps/api`.
