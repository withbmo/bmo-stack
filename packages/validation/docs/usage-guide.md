# Usage Guide

## API usage

Use the root package entry from backend code when you need shared constants or helper functions.

Example:

```ts
import { AUTH_CONSTANTS, validatePasswordStrength } from '@pytholit/validation';
```

Common API use cases:

- use `AUTH_CONSTANTS` in Nest DTO decorators
- use `PROJECT_CONSTANTS` in project DTOs
- use `normalizeEmailOrNull` in auth hooks
- use `validatePasswordStrength` in auth plugins
- use `getPasswordStrength` in API helper endpoints

## Web usage

Use the root entry or the frontend-friendly `@pytholit/validation/zod` entry when the client needs shared constants.

Example:

```ts
import { AUTH_CONSTANTS } from '@pytholit/validation';
```

Typical web use cases:

- username validation before form submit
- matching API validation rules for auth forms
- keeping onboarding validation aligned with backend expectations

## When not to use this package

Do not add app-specific DTOs, form objects, or route-only validation classes here.

Examples that should stay outside this package:

- Nest DTO classes for a specific controller
- React form state types
- endpoint-specific request and response mapping

## Rule of thumb

Ask one question before adding something here:

Does this validation rule need to stay identical across app boundaries?

If yes, it is a good candidate for `@pytholit/validation`.

If no, keep it in the app that owns the behavior.
