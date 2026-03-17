# OAuth Onboarding

## Why this flow exists

A social login can authenticate a user successfully but still leave the account missing product-required profile fields such as username or reliable name data.

The auth system therefore includes a separate OAuth onboarding flow for users who authenticate through Google or GitHub but still need to complete profile setup.

## How a user becomes onboarding-required

After `/callback/google` or `/callback/github`, `AuthEventsHook` checks whether the user looks like a newly created OAuth-only user.

The hook marks `oauthOnboardingRequired = true` on the account when all of the following are true:

- a matching OAuth account exists for that provider
- onboarding has not already been completed
- onboarding is not already marked as required
- the user has no hashed password
- the user was created recently

This logic prevents old or already-completed accounts from being pushed through the onboarding flow again.

## Name hydration behavior

During verification and OAuth callback hooks, the system attempts to backfill:

- `firstName`
- `lastName`

It tries provider payload fields first, then falls back to splitting a full name or username-like source.

This is best-effort only. Failures are logged but do not fail the auth request.

## API endpoints

### `GET /users/me/oauth-onboarding`

Returns:

- `required`
- `completedAt`

Business meaning:

- `required = true` means the frontend should block normal completion and collect onboarding fields

### `PATCH /users/me/oauth-onboarding`

Accepts:

- `username`
- `firstName`
- `lastName`
- optional `bio`

Completion behavior:

- updates the user profile
- clears `oauthOnboardingRequired` on all non-email-password accounts
- writes `oauthOnboardingCompletedAt`

## Related account actions

The users controller also exposes:

- `POST /users/me/set-password`

This matters because an OAuth-only user may later choose to add a password-based login path after onboarding.

## Product effect

This flow lets the business accept fast social sign-in while still enforcing profile completeness and username quality for the rest of the product.
