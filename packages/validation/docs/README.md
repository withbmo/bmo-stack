# `@pytholit/validation`

## Overview

`@pytholit/validation` is the shared validation package for values and rules that are used by more than one app in the workspace.

It currently provides:

- shared auth validation constants
- shared project validation constants
- email normalization helpers
- password-strength helpers built on `zxcvbn`

It does not own API request DTOs or frontend form state. Those stay in the app that uses them.

## Docs

- [Boundary and Ownership](./boundary-and-ownership.md)
- [Public API Reference](./public-api-reference.md)
- [Usage Guide](./usage-guide.md)

## Package entry points

- `@pytholit/validation`
  Exposes the full shared package surface used by API and web.

- `@pytholit/validation/zod`
  Exposes the shared validation constants through a frontend-friendly entry point.

## Current consumers

- `apps/api`
  Uses shared constants for request DTO rules and shared helpers for auth logic.

- `apps/web`
  Uses shared constants for auth form rules and onboarding validation.
