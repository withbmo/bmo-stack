# Auth Architecture

## Overview

The authentication subsystem is implemented as a global NestJS module located at `apps/api/src/auth`. It integrates Better Auth into the API and adds project-specific policy around request protection, provider enablement, password validation, verification throttling, login lockouts, and user profile hydration.

At a high level, the system is split into two layers:

- Better Auth routes served under `/api/v1/auth`
- NestJS-managed auth helpers served under `/auth-flow`

Better Auth owns the core authentication engine. NestJS owns how that engine is exposed and enforced across the rest of the application.

## Architectural responsibilities

### Better Auth layer

Better Auth is responsible for:

- session creation and session lookup
- email/password authentication
- OAuth provider sign-in and callback handling
- email verification
- OTP-based auth flows
- account persistence and verification persistence
- core auth route handling

### NestJS integration layer

The local auth module is responsible for:

- global auth enforcement through a custom Nest guard
- translating auth engine errors into the API's response shape
- exposing route metadata for public endpoints
- normalizing `request.user` into a stable internal contract
- adding custom hooks and plugins for business rules
- exposing small frontend-facing helper endpoints

## Main runtime components

### `AuthModule`

`auth.module.ts` is the composition root for auth inside the API. It:

- registers the Better Auth Nest adapter asynchronously
- creates the Better Auth instance through `createBetterAuth`
- disables Better Auth's built-in global guard in favor of a local one
- disables Better Auth's trusted-origin CORS automation so CORS remains centralized in `main.ts`
- relies on the Nest Better Auth adapter to restore body parsing for non-auth routes after Nest starts with `bodyParser: false`
- registers `BetterAuthGuard` as a global app guard
- provides hook classes for discovery by the Better Auth Nest adapter

Because the module is marked `@Global()`, the rest of the API can rely on the auth guard and decorators without re-importing auth everywhere.

### `createBetterAuth`

`better-auth.config.ts` builds the Better Auth instance and is the behavioral center of the subsystem. It configures:

- **baseURL** (from `API_URL`) so OAuth callbacks and email links use the correct API root
- the PostgreSQL-backed Better Auth database adapter
- trusted origins
- the Better Auth master secret from `JWT_SECRET`, with a development fallback to `JWT_SECRET_DEFAULT`
- session model mapping and expiration rules
- email/password behavior
- email verification behavior (emails sent via `@better-auth/infra`)
- OTP behavior (OTP emails via `@better-auth/infra`)
- **captcha**: Better Auth's built-in cloudflare-turnstile plugin on sign-up, sign-in, and send-verification-otp
- canonical email storage via the `normalized_email` database column mapped to Better Auth's `email` field
- username validation
- OAuth provider registration
- account linking behavior
- database hooks for encrypting stored provider tokens
- custom plugins: password strength, provider gate

### `BetterAuthGuard`

`better-auth.guard.ts` is the global enforcement point for authenticated requests. Rather than exposing raw Better Auth session data directly to the rest of the app, the guard normalizes the user shape and enforces extra policy:

- unauthenticated requests are rejected unless the route is public
- unverified users are rejected
- inactive users are rejected
- authenticated requests receive a normalized `request.user`

This keeps controller code simple and ensures that downstream code sees a consistent contract regardless of how Better Auth shapes its internal session object.

### `AuthController`

`auth.controller.ts` exposes public helper endpoints that sit beside Better Auth:

- `GET /auth-flow/providers`
- `POST /auth-flow/check-password-strength`

These routes support frontend UX but do not replace the Better Auth engine itself.

## Hooks and plugins

The module extends Better Auth with both hook providers and plugins.

### Hook providers

Hook providers use `@BeforeHook` and `@AfterHook` through `@thallesp/nestjs-better-auth`. They are used for:

- login lockout checks and failure tracking
- verification-email resend cooldowns
- user profile hydration after auth events
- OAuth onboarding flags for new OAuth-only users

### Plugins

Plugins are registered directly in the Better Auth config and act like middleware around auth requests. They are used for:

- password strength enforcement
- provider availability checks

## Data and service dependencies

The auth subsystem depends on several services outside `src/auth`:

- `PrismaService` for user, account, and verification persistence (used by auth hooks)
- `DistributedLockService` for Redis: its client is used by the login lockout hook (rate-limiter-flexible) for per-email failure tracking
- config defaults and validated env values from `src/config`
- shared validation constants and password/email helpers from `@pytholit/validation`
- shared backend-facing response/domain types from `@pytholit/contracts`
- email sending through **@better-auth/infra** (`sendEmail`), imported dynamically in Better Auth config for verification, deletion, and OTP templates

Those dependencies are part of the full runtime contract of the auth subsystem even though their code lives elsewhere.
