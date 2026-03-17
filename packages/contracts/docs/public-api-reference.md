# Public API Reference

## Auth Contracts

### `PasswordStrengthResponse`

Returned by auth password-strength checks.

Fields:

- `score`: numeric strength score from `0` to `4`
- `label`: human-readable label
- `crackTime`: estimated crack time string
- `feedback`: suggestion list
- `isStrong`: whether the password meets the product threshold

### `OAuthProvider`

Current supported values:

- `'google'`
- `'github'`

### `EnabledOAuthProvidersResponse`

Used by the API auth helper route that returns which OAuth providers are enabled in the current environment.

Shape:

```ts
{
  providers: OAuthProvider[];
}
```

### `OAuthOnboardingStatusResponse`

Used by the user onboarding status endpoint for OAuth-created accounts.

Shape:

```ts
{
  required: boolean;
  completedAt: string | null;
}
```

## User Contract

### `User`

Canonical shared user profile shape returned by the API.

Fields:

- `id`
- `email`
- `username`
- `firstName`
- `lastName`
- `bio`
- `avatarUrl`
- `isEmailVerified`
- `isActive`
- `oauthOnboardingRequired`
- `oauthOnboardingCompletedAt`
- `createdAt`
- `updatedAt`
- `plan`

Notes:

- `plan` is currently always `null`
- `createdAt`, `updatedAt`, and onboarding timestamps are ISO strings

## Project Contract

### `Project`

Shared project response shape.

Fields:

- `id`
- `ownerId`
- `name`
- `slug`
- `repoExportEnabled`
- `createdAt`
- `updatedAt`

## Deployment Contracts

### `DEPLOY_JOB_STATUS`

Shared runtime status constant object.

Values:

- `queued`
- `running`
- `succeeded`
- `failed`
- `canceled`

### `DeployJobStatus`

Union type derived from `DEPLOY_JOB_STATUS`.

### `DEPLOY_JOB_STEP_STATUS`

Shared runtime step-status constant object.

Values:

- `queued`
- `running`
- `succeeded`
- `failed`
- `skipped`

### `DeployJobStepStatus`

Union type derived from `DEPLOY_JOB_STEP_STATUS`.

### `DeployJobStep`

Shape:

```ts
{
  key: string;
  title: string;
  status: DeployJobStepStatus;
}
```

### `DeployJob`

Shared deployment job response shape.

Fields:

- `id`
- `projectId`
- `triggeredByUserId`
- `status`
- `currentStep`
- `steps`
- `source`
- `createdAt`
- `startedAt`
- `finishedAt`
- optional `project`

`source` shape:

```ts
{
  origin: string;
  ref: string;
}
```
