# Contracts Package

`@pytholit/contracts` contains the shared TypeScript contract layer used across the Pytholit applications.

Its purpose is narrow on purpose:

- define stable backend-facing response and domain shapes shared by multiple apps
- expose shared runtime status constants that must stay identical across API, web, and UI packages
- avoid duplicating wire-level response types in each app

It is not the place for:

- API-only DTOs or validation rules
- frontend-only view models
- environment/config helpers
- auth session state helpers or browser storage constants
- temporary product-specific convenience types that only one app uses

## Contents

- [Boundary and Ownership](./boundary-and-ownership.md)
- [Public API Reference](./public-api-reference.md)
- [Usage Guide](./usage-guide.md)

## Current Public Surface

The package currently exports:

- `User`
- `Project`
- `DeployJob`
- `DeployJobStep`
- `DeployJobStatus`
- `DeployJobStepStatus`
- `DEPLOY_JOB_STATUS`
- `DEPLOY_JOB_STEP_STATUS`
- `PasswordStrengthResponse`
- `EnabledOAuthProvidersResponse`
- `OAuthOnboardingStatusResponse`

## Source Files

The active source files are:

- `src/index.ts`
- `src/auth.ts`
- `src/user.ts`
- `src/project.ts`
- `src/deployment.ts`

## Who Uses It

Current main consumers:

- `apps/api` for controller/service response typing
- `apps/web` for API response typing and deployment status constants
- `packages/ui` for deployment status typing

## Guiding Rule

If a type describes the API contract seen by more than one app, it likely belongs here.

If a type describes how one app internally works, renders, validates, or stores state, it should stay in that app.
