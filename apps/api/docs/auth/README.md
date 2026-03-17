# Authentication Documentation

This section documents the authentication subsystem implemented in `apps/api/src/auth`.

The API uses Better Auth as the core authentication engine and wraps it with NestJS-specific guards, decorators, filters, hooks, and helper endpoints. The result is a single auth layer that is consistent across the API surface and explicit about business rules such as email verification, account activation, provider availability, and login lockouts.

## Contents

- [Architecture](./architecture.md)
- [Business Rules](./business-rules.md)
- [User Journeys](./user-journeys.md)
- [OAuth Onboarding](./oauth-onboarding.md)
- [Route Reference](./route-reference.md)
- [Configuration](./configuration.md)
- [Request and User Flows](./flows.md)
- [Source File Reference](./files-reference.md)

## Scope

These documents cover:

- business behavior for sign-up, login, OAuth, verification, and forgot-password flows
- Better Auth bootstrap and runtime configuration
- NestJS integration and request lifecycle behavior
- custom hooks and plugins
- OAuth provider handling
- password and verification flows
- file-by-file responsibilities for everything in `apps/api/src/auth`

## Recommended reading order

1. Start with [Architecture](./architecture.md) for the module shape and runtime boundaries.
2. Read [Business Rules](./business-rules.md) for the product-facing auth rules.
3. Read [User Journeys](./user-journeys.md) for sign-up, login, OAuth, and forgot-password behavior.
4. Use [OAuth Onboarding](./oauth-onboarding.md) to understand the social-login completion flow.
5. Continue with [Configuration](./configuration.md) for environment variables and Better Auth options.
6. Use [Route Reference](./route-reference.md) and [Source File Reference](./files-reference.md) when implementing or debugging.
