# Auth Business Rules

## Overview

This page describes the business logic enforced by the authentication system, independent of the underlying Better Auth implementation details.

## Core rules

### Authentication is session-based

- protected API routes depend on a valid Better Auth session
- the global auth guard resolves that session on every protected request

### Email verification is required

- email/password accounts are not treated as fully usable immediately after sign-up
- the guard rejects unverified users on protected routes with `AUTH_EMAIL_UNVERIFIED`
- verification is therefore a required step, not an optional account enhancement

### Inactive accounts are blocked

- authenticated but inactive users are rejected with `AUTH_ACCOUNT_INACTIVE`

### Public auth helper routes exist beside Better Auth

The API exposes helper routes that support frontend UX:

- `GET /auth-flow/providers`
- `POST /auth-flow/check-password-strength`

These do not replace Better Auth routes. They support product behavior around provider discovery and password UX.

## Sign-up rules

### Password sign-up uses policy validation

- sign-up requests through `/sign-up/email` are intercepted by the password validator plugin
- password strength is validated through the shared validation package
- weak passwords are rejected before account creation completes

### Verification is expected after sign-up

- sign-up triggers verification email behavior
- users are expected to verify before using protected routes
- after verification, Better Auth is configured to auto-sign the user in

### Verification resend is rate-limited by active token state

- `/send-verification-email` is subject to a cooldown hook
- if an unexpired verification token already exists, resend is rejected with `AUTH_VERIFICATION_COOLDOWN`

## Login rules

### Email login is rate-limited and lock-protected

- Better Auth rate-limits `/sign-in/email`
- the custom lockout hook adds per-email failed-login tracking
- after repeated failures, login is temporarily blocked with `AUTH_LOGIN_LOCKED`
- successful login clears the failure counter

### Email login requires a verified, active account for protected usage

- even if credentials are correct, the user still must be verified to pass guarded API routes
- inactive users are also blocked

## OAuth rules

### Only configured providers are allowed

- `/sign-in/social` is intercepted by the provider gate plugin
- a provider must exist in `OAUTH_PROVIDERS`
- it must also have client ID and client secret configured
- otherwise the request fails with `AUTH_OAUTH_PROVIDER_DISABLED`

### Provider list is environment-aware

- the frontend can ask `GET /auth-flow/providers`
- the API returns only providers that are actually configured in the current environment

### Account linking is intentionally conservative

- account linking is enabled
- trusted providers include the configured OAuth providers and `email-password`
- different-email linking is not allowed
- unlinking all providers is not allowed

### New OAuth-only users may require onboarding

After OAuth callback:

- the system attempts to infer user names from the auth payload
- if the user looks newly created and does not have a password-based setup, the account may be marked `oauthOnboardingRequired`

This is the business rule that forces some social-login users through an onboarding completion step after first sign-in.

## Forgot-password and reset-password rules

### Reset password is protected by the same password policy

- the password validator plugin also intercepts `/reset-password`
- it validates `newPassword` using the shared password-strength rules

### Forgot-password emails are customized

- when Better Auth runs the forgot-password OTP flow, the module sends the `reset-password-otp` email template

### Resetting a password is separate from OAuth onboarding

- forgot-password is for users who already have an email/password account
- OAuth-only onboarding is a different flow and is handled through user profile endpoints

## OAuth onboarding rules

### When onboarding is considered required

OAuth onboarding is considered required when:

- the user has no username, or
- one of the linked non-email-password accounts has `oauthOnboardingRequired = true`

### How onboarding is completed

The frontend calls:

- `GET /users/me/oauth-onboarding`
- `PATCH /users/me/oauth-onboarding`

Completion updates:

- username
- first name
- last name
- optional bio
- all non-email-password accounts are marked with `oauthOnboardingRequired = false`
- `oauthOnboardingCompletedAt` is recorded
