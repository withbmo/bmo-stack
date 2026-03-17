# Auth Configuration

## Overview

Authentication behavior is assembled from Nest `ConfigService` values plus a set of Better Auth options defined in `apps/api/src/auth/better-auth.config.ts`.

This document focuses on the operational meaning of those settings rather than repeating implementation code.

## Environment variables

### Core secrets

`JWT_SECRET`

- used as Better Auth's master secret
- required in production
- falls back to `JWT_SECRET_DEFAULT` outside production

`INTERNAL_SECRET`

- used to derive the encryption key for provider tokens stored in the accounts table
- currently falls back to a temporary development default if not set

### Infrastructure

`DB_HOST`

- used by the PostgreSQL connection that Better Auth reads and writes through

`DB_PORT`

- database port for Better Auth and Prisma

`DB_NAME`

- database name for Better Auth and Prisma

`DB_USERNAME`

- database username for Better Auth and Prisma

`DB_PASSWORD`

- database password for Better Auth and Prisma

`DB_SSLMODE`

- SSL mode for PostgreSQL connections

### Public URLs

`FRONTEND_URL`

- added to Better Auth trusted origins
- defaults to `FRONTEND_URL_DEFAULT` if unset

`API_URL`

- used as Better Auth's **baseURL** (root URL of the API, e.g. `http://localhost:3001`)
- added to Better Auth trusted origins
- used to build default OAuth callback URLs when provider callback URLs are not set
- defaults to `API_URL_DEFAULT` (`http://localhost:3001`) if unset
- should be set explicitly in production so OAuth callbacks and auth emails resolve correctly

### Captcha

`TURNSTILE_SECRET_KEY`

- used by Better Auth's built-in **cloudflare-turnstile** captcha plugin on sign-up, sign-in, and send-verification-otp
- **required in production**: the app throws at startup if unset when `NODE_ENV === 'production'`
- in non-production, the plugin uses Cloudflare's test secret (always passes) so the key is optional

### OAuth provider configuration

The provider registry is centralized in `apps/api/src/auth/auth-providers.config.ts`.

Current providers:

- Google
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - optional `GOOGLE_CALLBACK_URL`
- GitHub
  - `GITHUB_CLIENT_ID`
  - `GITHUB_CLIENT_SECRET`
  - optional `GITHUB_CALLBACK_URL`

If a callback URL is not explicitly configured, the API derives it from `API_URL`:

- `${API_URL}/api/v1/auth/callback/google`
- `${API_URL}/api/v1/auth/callback/github`

## Better Auth routing and persistence

### Base path and base URL

- **basePath**: all Better Auth routes are mounted under `/api/v1/auth`.
- **baseURL**: set from `API_URL`. This is the root URL where the API is served (e.g. `http://localhost:3001`). It is used to build OAuth redirect URIs and links in verification/deletion emails.

### Database

Better Auth is configured against PostgreSQL through:

- `kysely`
- `pg`
- `PostgresDialect`

### Model mapping

The auth subsystem maps Better Auth models to the local database naming convention.

User model:

- model name: `users`
- `name -> username`
- `emailVerified -> is_email_verified`
- `image -> avatar_url`
- `createdAt -> created_at`
- `updatedAt -> updated_at`

Additional user fields:

- `firstName -> first_name`
- `lastName -> last_name`
- `isActive -> is_active`

Session model:

- model name: `sessions`
- `expiresAt -> expires_at`
- `createdAt -> created_at`
- `updatedAt -> updated_at`
- `ipAddress -> ip_address`
- `userAgent -> user_agent`
- `userId -> user_id`

Account model:

- model name: `accounts`
- token fields map to snake_case storage columns
- account linking is enabled

Verification model:

- model name: `verification`

## Session behavior

Session settings are driven by shared constants:

- `AUTH_SESSION_TTL_SECONDS`
- `AUTH_SESSION_UPDATE_AGE_SECONDS`

Configured behavior:

- session expiration uses `AUTH_SESSION_TTL_SECONDS`
- session refresh/update age uses `AUTH_SESSION_UPDATE_AGE_SECONDS`
- cookie cache is enabled and uses the same TTL

## Authentication methods

### Email and password

Configured with:

- enabled: `true`
- minimum password length: `8`
- email verification required: `true`

The local password validator plugin adds stricter password quality enforcement on top of Better Auth's basic minimum-length rule.

### Email verification

Configured with:

- `sendOnSignUp: true`
- `sendOnSignIn: false`
- `autoSignInAfterVerification: true`

Verification, deletion, and OTP emails are sent via **@better-auth/infra** (`sendEmail`). Templates used: `verify-email`, `delete-account`, `sign-in-otp`, `reset-password-otp`, `verify-email-otp`. Install the `@better-auth/infra` package for runtime.

## Nest adapter integration

The API bootstrap in `main.ts` starts Nest with `bodyParser: false`.

This is intentional. The current `@thallesp/nestjs-better-auth` adapter expects Nest's built-in parser to be disabled so Better Auth auth routes can avoid premature parsing. The adapter then restores normal parsing for non-auth routes.

Related runtime behavior:

- CORS is configured centrally in `main.ts`
- Better Auth trusted-origin CORS automation is disabled in `AuthModule`
- there is no separate custom body-parser setup file anymore

### Email OTP

Configured with:

- 6-digit OTPs
- 10-minute expiry
- 5 allowed attempts
- hashed OTP storage
- Better Auth's default email verification flow overridden

Email templates by flow:

- sign-in: `sign-in-otp`
- forgot password: `reset-password-otp`
- verification fallback: `verify-email-otp`

### Username rules

The username plugin enforces:

- minimum length `3`
- maximum length `30`
- reserved values blocked: `admin`, `support`, `root`, `system`
- username regex: `^[a-zA-Z0-9._]+$`
- display username regex: `^[a-zA-Z0-9 _-]+$`

### OAuth and account linking

Social providers are assembled dynamically from the provider registry and current environment.

Account linking is configured with:

- linking enabled
- implicit linking allowed
- trusted providers include all registered OAuth providers plus `email-password`
- different-email linking disabled
- unlinking all providers disabled

## Rate limiting and abuse controls

### Better Auth route-level limits

Global Better Auth rate limit:

- 100 requests per 60 seconds
- storage type: database

Custom Better Auth rules:

- `/email-otp/send-verification-otp`
  - 5 requests per hour
- `/sign-in/email`
  - 5 requests per minute

### Nest controller throttling

`AuthController` adds separate throttling for helper endpoints:

- controller default: 5 requests per minute in the `auth` bucket
- `GET /auth-flow/providers`: throttling skipped
- `POST /auth-flow/check-password-strength`: 20 requests per minute in the default bucket

### Additional business-rule controls

Beyond Better Auth's built-in rate limiting, the module adds:

- verification resend cooldown based on active verification records (Nest hook)
- Redis-backed login lockouts after repeated failed email sign-ins (Nest hook using rate-limiter-flexible)
- captcha enforcement via Better Auth's built-in **cloudflare-turnstile** plugin on `/sign-up/email`, `/sign-in/email`, and `/email-otp/send-verification-otp`

## Token encryption at rest

Before account records are created or updated, provider tokens are encrypted by local database hooks.

Encrypted fields:

- `accessToken`
- `refreshToken`
- `idToken`

Encryption details:

- algorithm: AES-256-GCM
- key derivation: HKDF-SHA256
- versioned prefix: `enc:v1:`

This protects provider-issued credentials before they are written to persistent storage.
