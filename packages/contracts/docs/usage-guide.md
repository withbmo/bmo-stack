# Usage Guide

## Importing

Import from the package root:

```ts
import type { User, Project, DeployJob } from '@pytholit/contracts';
import { DEPLOY_JOB_STATUS } from '@pytholit/contracts';
```

Do not import from deep internal paths like `@pytholit/contracts/src/user`.

## In `apps/api`

Use contracts for outward-facing response types:

```ts
import type { User } from '@pytholit/contracts';

async getProfile(): Promise<User> {
  // map internal model -> shared contract
}
```

Good uses:

- controller return types
- service return types when they directly shape API output
- shared status constants for API-visible enums

Avoid:

- using contracts as DTOs for request validation
- using contracts as a replacement for internal persistence models

## In `apps/web`

Use contracts for raw API response shapes:

```ts
import type { User } from '@pytholit/contracts';

const user = await apiRequest<User>('/api/v1/users/me');
```

Then map into view models only when the UI needs a different shape.

Good uses:

- fetch-layer response typing
- shared deployment status constants
- auth helper response typing

Avoid:

- putting page-local state types into `@pytholit/contracts`
- forcing UI-only models to match backend wire shapes when the UI needs extra fields

## Adding a New Contract

When adding a new export:

1. add it in the relevant source file
2. re-export it from `src/index.ts`
3. use it from the package root in consuming code
4. update these docs if the public surface changed

## Anti-Patterns

Avoid these common mistakes:

- exporting types used by only one app
- storing validation schemas in the contracts package
- keeping deprecated aliases alive indefinitely
- duplicating the same API response shape in both API and web after a contract already exists
