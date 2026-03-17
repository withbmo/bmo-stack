# User Journeys

## 1. Email sign-up journey

### Goal

Create an email/password account and convert it into a verified, usable session.

### Business sequence

1. The client may call `POST /auth-flow/check-password-strength` for UX feedback.
2. The user submits Better Auth email sign-up.
3. The password validator plugin enforces the shared password policy.
4. Better Auth creates the account.
5. Verification email behavior is triggered.
6. Until verification happens, protected API routes reject the user as unverified.
7. The user verifies through the Better Auth verification flow.
8. Better Auth auto-signs the user in after verification.
9. Post-verification hooks try to hydrate first and last name fields when possible.

### Important outcomes

- sign-up alone does not produce a fully usable protected-route identity
- verification is part of the business journey, not an optional afterthought

## 2. Email login journey

### Goal

Allow a known user to sign in with email and password while protecting the system from repeated brute-force attempts.

### Business sequence

1. The user submits Better Auth email sign-in.
2. The login lockout hook checks whether the normalized email is currently blocked.
3. If blocked, the request fails with `AUTH_LOGIN_LOCKED`.
4. Better Auth validates credentials.
5. After the attempt:
   - success clears the limiter state
   - `401` failure increments the limiter
6. Once enough failures accumulate, the address is blocked for a lockout window.
7. On later protected requests, the global guard still checks verification and account activity.

### Important outcomes

- successful credential validation is not the only condition
- users must also be verified and active to pass guarded application routes

## 3. OAuth sign-in journey

### Goal

Allow users to sign in with supported social providers while controlling provider availability and onboarding quality.

### Business sequence

1. The frontend asks `GET /auth-flow/providers` to learn which providers are available.
2. The user starts social sign-in through Better Auth.
3. The provider gate plugin verifies that the selected provider is known and configured.
4. Better Auth processes the OAuth handshake.
5. After callback:
   - auth hooks try to infer missing first/last names
   - new OAuth-only accounts may be marked `oauthOnboardingRequired`
6. The user is signed in.
7. The frontend can query `GET /users/me/oauth-onboarding`.
8. If onboarding is required, the frontend collects username, first name, last name, and optional bio.
9. The frontend completes onboarding via `PATCH /users/me/oauth-onboarding`.

### Important outcomes

- provider availability is environment-dependent
- OAuth sign-in can succeed while still requiring profile completion afterward

## 4. Forgot-password journey

### Goal

Let an existing email/password user regain access without weakening password policy.

### Business sequence

1. Better Auth starts the forgot-password flow.
2. The module sends the `reset-password-otp` email template for the forgot-password OTP type.
3. The user reaches the reset-password step.
4. The password validator plugin intercepts `/reset-password`.
5. `newPassword` is validated with the same shared password-strength rules used at sign-up.
6. Better Auth completes the password reset flow.

### Important outcomes

- forgot-password uses the same password policy as sign-up
- password resets are intentionally consistent with account creation rules

## 5. Verification resend journey

### Goal

Avoid repeated resend spam while a valid verification token already exists.

### Business sequence

1. The user asks to resend verification.
2. The cooldown hook checks the verification table for an active unexpired token.
3. If one exists, resend fails with `AUTH_VERIFICATION_COOLDOWN`.
4. If none exists, Better Auth continues the resend flow.

### Important outcomes

- resend behavior is governed by current token state, not only by a generic rate limit
