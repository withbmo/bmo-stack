# Request and User Flows

## Protected request flow

1. A request reaches a NestJS route.
2. `BetterAuthGuard` executes because it is registered globally.
3. The guard checks whether the route or controller is marked `@Public()`.
4. If the route is not public, the guard calls `auth.api.getSession({ headers })`.
5. If no session is returned, the request fails with `AUTH_UNAUTHENTICATED`.
6. If a session exists but the user is not verified, the request fails with `AUTH_EMAIL_UNVERIFIED`.
7. If a session exists but the user is inactive, the request fails with `AUTH_ACCOUNT_INACTIVE`.
8. On success, the guard stores `request.session` and a normalized `request.user`.

## Email sign-in with lockout protection

1. A Better Auth request reaches `/sign-in/email`.
2. `LoginLockoutHook.checkLock` normalizes the email and checks the Redis-backed rate limiter.
3. If the email is already blocked, the request fails with `AUTH_LOGIN_LOCKED`.
4. Better Auth processes the sign-in attempt.
5. `LoginLockoutHook.trackResult` runs after the auth attempt completes.
6. If the attempt succeeded, the lockout counter is cleared for that email.
7. If the attempt failed with a `401`, one failure point is consumed.
8. After five failed attempts within ten minutes, the address is blocked for ten minutes.

## Verification resend cooldown

1. A Better Auth request reaches `/send-verification-email`.
2. `EmailVerificationCooldownHook` extracts and normalizes the request email.
3. The hook looks for an unexpired verification record for that identifier.
4. If one exists, the request fails with `AUTH_VERIFICATION_COOLDOWN`.
5. If none exists, Better Auth proceeds with the verification send flow.

This prevents repeated resend attempts while a valid verification token is already active.

## Sign-up and reset-password validation

1. A Better Auth request reaches `/sign-up/email` or a reset-password route.
2. `passwordValidatorPlugin` intercepts the request before Better Auth handles it.
3. The plugin extracts `password` for sign-up or `newPassword` for password reset.
4. The value is validated with `validatePasswordStrength` from `@pytholit/validation`.
5. Invalid passwords fail before the auth operation continues.

This keeps password policy centralized in the shared validation package.

## OAuth sign-in gating

1. A Better Auth request reaches `/sign-in/social`.
2. `providerGatePlugin` reads the requested provider from `body.provider`.
3. The plugin verifies that the provider exists in `OAUTH_PROVIDERS`.
4. It then verifies that the provider has both client ID and client secret configured.
5. If either check fails, the request is rejected with `AUTH_OAUTH_PROVIDER_DISABLED`.

This ensures the API does not accept requests for unknown or partially configured providers.

## OAuth callback post-processing

After a successful OAuth callback for Google or GitHub, `AuthEventsHook` performs post-auth maintenance:

1. It tries to resolve the authenticated user ID from the Better Auth hook context.
2. It loads the current user record from the database.
3. If `firstName` and `lastName` are still missing, it attempts to infer them from the auth payload.
4. It checks whether the user appears to be a newly created OAuth-only account.
5. If so, it marks the matching auth account with `oauthOnboardingRequired = true`.

The onboarding flag is only set when the account looks new, has not already completed onboarding, and does not already have a password-based setup.

## Email verification post-processing

After `/verify-email` and `/email-otp/verify-email`, `AuthEventsHook` also tries to hydrate missing user name fields from the auth context returned by Better Auth.

This is a best-effort enhancement and is intentionally non-blocking. Failures are logged but do not break the verification flow.

## Frontend helper endpoints

### `GET /auth-flow/providers`

Purpose:

- returns only OAuth providers that are fully configured in the current environment
- allows the frontend to render available social-auth options dynamically

### `POST /auth-flow/check-password-strength`

Purpose:

- accepts `CheckPasswordStrengthDto`
- returns `PasswordStrengthResponse`
- supports client-side password UX
- does not persist any data
