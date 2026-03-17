# Auth Route Reference

## Public helper routes in the Nest controller

### `GET /api/v1/auth-flow/providers`

Purpose:

- returns the OAuth providers that are actually configured

Notes:

- public
- throttling skipped

### `POST /api/v1/auth-flow/check-password-strength`

Purpose:

- gives frontend UX feedback about password quality

Notes:

- public
- does not create or modify auth data

## Better Auth routes with custom business logic

### `/sign-up/email`

Custom behavior:

- password validator plugin enforces shared password policy
- captcha protection is configured
- email verification is expected after sign-up

### `/sign-in/email`

Custom behavior:

- custom Better Auth rate limit
- login lockout hook enforces failed-attempt blocking
- captcha protection is configured

### `/sign-in/social`

Custom behavior:

- provider gate plugin blocks unknown or disabled providers

### `/callback/google`

Custom behavior:

- attempts name hydration
- may mark `oauthOnboardingRequired`

### `/callback/github`

Custom behavior:

- attempts name hydration
- may mark `oauthOnboardingRequired`

### `/verify-email`

Custom behavior:

- post-verification hook attempts name hydration
- auto-sign-in after verification is enabled in config

### `/email-otp/verify-email`

Custom behavior:

- post-verification hook attempts name hydration

### `/send-verification-email`

Custom behavior:

- cooldown hook blocks resend when an active verification record already exists

### `/reset-password`

Custom behavior:

- password validator plugin enforces shared password policy for `newPassword`

## Related user routes

These are outside the auth module but are part of the post-auth business journey.

### `GET /api/v1/users/me/oauth-onboarding`

- returns whether OAuth onboarding is still required

### `PATCH /api/v1/users/me/oauth-onboarding`

- completes the social-login onboarding profile step

### `POST /api/v1/users/me/change-password`

- changes the current password for an authenticated user

### `POST /api/v1/users/me/set-password`

- allows setting a password for an authenticated user, including OAuth-origin users
