# Auth (web) — developer guide

This folder contains the client-side state and hooks used by the auth pages. The network/API surface is centralized in `apps/web/src/shared/lib/auth.ts`.

## Source of truth (contracts)
- **Shared API/domain types**: `packages/contracts/src/index.ts`
- **Shared validation constants/helpers**: `packages/validation/src/index.ts`
- Frontend-only auth flow helper types stay local in `apps/web/src/shared/lib/auth.ts`

## Frontend pages (Next.js routes)
- **Login**: `apps/web/src/app/(site)/auth/login/page.tsx`
- **Signup**: `apps/web/src/app/(site)/auth/signup/page.tsx`
- **OAuth callback**: `apps/web/src/app/(site)/auth/callback/page.tsx`

## Backend endpoints used by the web app
- **Password login/signup/reset + OTP** (native Better Auth)
  - `POST /api/v1/auth/sign-up/email`
  - `POST /api/v1/auth/sign-in/email`
  - `POST /api/v1/auth/email-otp/send-verification-otp`
  - `POST /api/v1/auth/email-otp/verify-email`
  - `POST /api/v1/auth/forget-password`
  - `POST /api/v1/auth/reset-password`
- **OAuth** (Better Auth)
  - `POST /api/v1/auth/sign-in/social` → returns redirect URL
  - Callback handled by Better Auth, redirects to frontend

## Flow sketches

### Password login
```mermaid
sequenceDiagram
  participant Web
  participant API
  Web->>API: POST /auth/sign-in/email
  API-->>Web: success + Set-Cookie
  Web->>API: GET /users/me
  API-->>Web: { user }
  Web->>Web: redirect /dashboard
```

### OAuth login
```mermaid
sequenceDiagram
  participant Web
  participant API
  Web->>API: POST /auth/sign-in/social { provider, callbackURL }
  API-->>Web: { url }
  Web->>Web: redirect to OAuth provider
  Web->>API: OAuth callback (handled by Better Auth)
  API-->>Web: set cookie, redirect to callbackURL
  Web->>API: GET /users/me
  API-->>Web: { user }
  Web->>Web: redirect /dashboard
```

## Where to edit things
- **API calls / auth client**: `apps/web/src/shared/lib/auth.ts`
- **Session state + auth state**: `apps/web/src/shared/auth/stores/auth-context.tsx`
