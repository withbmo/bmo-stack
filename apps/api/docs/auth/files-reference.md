# Source File Reference

This document covers every current source file under `apps/api/src/auth`.

## Root module files

### `auth.module.ts`

Role:

- defines the global auth module
- boots Better Auth with async configuration
- registers the global auth guard
- provides hook classes for auth lifecycle integration

Key design choice:

- Better Auth's built-in global guard is disabled so the API can enforce authentication policy through its own Nest guard
- Better Auth trusted-origin CORS automation is disabled because CORS is configured centrally in `main.ts`
- the adapter restores body parsing for non-auth routes after Nest starts with `bodyParser: false`

### `auth.controller.ts`

Role:

- exposes public helper routes related to auth UX

Endpoints:

- `GET /auth-flow/providers`
- `POST /auth-flow/check-password-strength`

Operational notes:

- controller is marked `@Public()`
- controller-level throttling is enabled

### `auth.types.ts`

Role:

- defines the normalized authenticated user contract attached to `request.user`

Fields:

- `id`
- `email`
- `username`
- `firstName`
- `lastName`
- `isEmailVerified`
- `isActive`

### `better-auth.config.ts`

Role:

- constructs the Better Auth instance used by the Nest adapter

Main responsibilities:

- **baseURL** (from `API_URL`) and base path for routes
- database adapter configuration (Kysely + PostgreSQL)
- session configuration
- rate limiting configuration (Better Auth native + custom rules)
- email/password configuration
- email verification and OTP configuration (emails sent via `@better-auth/infra`)
- OAuth provider configuration
- account token encryption hooks
- plugin registration: emailHarmony, password validator, **captcha (Better Auth built-in cloudflare-turnstile)**, provider gate, username, emailOTP

Operational notes:

- uses dynamic imports for Better Auth and several dependencies
- reads provider definitions from the centralized provider registry
- builds the PostgreSQL connection string from `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, and `DB_SSLMODE`
- resolves the Better Auth secret from `JWT_SECRET`, with a development fallback to `JWT_SECRET_DEFAULT`
- encrypts OAuth tokens before persistence
- derives default callback URLs from `API_URL`
- Turnstile: test secret in non-production; `TURNSTILE_SECRET_KEY` required in production

### `auth-providers.config.ts`

Role:

- provides the centralized registry of supported OAuth providers and their environment keys

Current providers:

- Google
- GitHub

Used by:

- Better Auth configuration
- provider gate plugin
- auth helper controller

## Decorators

### `decorators/current-user.decorator.ts`

Role:

- exposes `@CurrentUser()` for controller parameter injection

Behavior:

- `@CurrentUser()` returns the full normalized user
- `@CurrentUser('id')` returns a single property from the user object

Dependency:

- requires `BetterAuthGuard` to populate `request.user`

### `decorators/public.decorator.ts`

Role:

- exposes `@Public()` for unauthenticated routes

Behavior:

- aliases `AllowAnonymous`
- exports the shared metadata key used by `BetterAuthGuard`

## DTOs

### `dto/check-password-strength.dto.ts`

Role:

- validates the request body for password-strength checks

Validation rules:

- string value required
- minimum length `1`
- maximum length `128`

## Error helpers

### `errors/auth-errors.ts`

Role:

- standardizes common Nest-thrown authentication and authorization errors

Exports:

- `throwUnauthenticated`
- `throwForbidden`
- `throwEmailUnverified`
- `throwAccountInactive`
- `throwAdminRequired`

Response contract:

- `{ code, detail }`

## Guards

### `guards/better-auth.guard.ts`

Role:

- enforces authentication globally across the API
- normalizes Better Auth session data into the local user contract

Behavior:

- checks whether the route is public
- resolves the current session from request headers
- rejects unauthenticated requests on protected routes
- rejects unverified users
- rejects inactive users
- attaches `request.session`
- attaches normalized `request.user`

Why it matters:

- keeps authentication policy explicit in the API layer
- protects downstream controllers from Better Auth response-shape drift

## Hooks

### `hooks/auth-events.hook.ts`

Role:

- performs non-blocking post-auth side effects after selected Better Auth flows

Observed routes:

- `/verify-email`
- `/email-otp/verify-email`
- `/callback/google`
- `/callback/github`

Responsibilities:

- backfill missing `firstName` and `lastName`
- mark new OAuth-only accounts with `oauthOnboardingRequired` when appropriate

Implementation note:

- failures are logged and intentionally do not fail the auth operation

### `hooks/auth-hook.utils.ts`

Role:

- provides small shared utilities for auth hooks

Current export:

- `extractNormalizedEmail`

### `hooks/email-verification-cooldown.hook.ts`

Role:

- prevents duplicate verification email sends while a valid verification token still exists

Observed route:

- `/send-verification-email`

Behavior:

- looks up the latest unexpired verification record for the email
- rejects the request with `AUTH_VERIFICATION_COOLDOWN` when a cooldown is active

### `hooks/login-lockout.hook.ts`

Role:

- enforces per-email temporary lockouts after repeated failed sign-in attempts

Observed route:

- `/sign-in/email`

Behavior:

- uses **rate-limiter-flexible** with Redis (via `DistributedLockService.client()`) for atomic failure counting
- checks the limiter before sign-in; if already blocked, returns `AUTH_LOGIN_LOCKED`
- on success, clears the counter for that email
- on 401 failure, consumes one point; after five failures in the window, the address is blocked for the lockout duration

Dependency:

- `DistributedLockService` (Redis client for the rate limiter)

## Plugins

### `plugins/password-validator.plugin.ts`

Role:

- enforces shared password quality rules inside Better Auth request handling

Observed flows:

- email sign-up
- password reset

Behavior:

- extracts the relevant password field
- validates it through `validatePasswordStrength`

### `plugins/provider-gate.plugin.ts`

Role:

- blocks social-auth requests for unknown or disabled providers

Observed route:

- `/sign-in/social`

Behavior:

- validates the provider against `OAUTH_PROVIDERS`
- checks whether client credentials are configured
- rejects unavailable providers with `AUTH_OAUTH_PROVIDER_DISABLED`

Additional export:

- `isProviderEnabled`

## Utilities

### `utils/crypto.util.ts`

Role:

- encrypts and decrypts provider tokens stored in auth account records

Exports:

- `ENCRYPTED_PREFIX`
- `isEncrypted`
- `encryptToken`
- `decryptToken`

Implementation details:

- AES-256-GCM encryption
- HKDF-SHA256 key derivation
- versioned encrypted payload prefix

Primary usage:

- Better Auth account create/update database hooks in `better-auth.config.ts`
