# Public Exports

## Main runtime export

`src/index.ts` exports:

- `prisma`

This is the shared Prisma client instance consumed by the API package.

## Generated Prisma exports

The package also re-exports the generated Prisma client symbols from `src/generated/client.js`.

That includes:

- Prisma namespace/types
- generated model types
- generated client helpers

Consumers should import those from `@pytholit/db`, not from deep generated paths.

## Utility exports

`src/utils.ts` is also re-exported from the package root.

Current known consumer pattern includes helper usage such as:

- `exclude(...)` in the API users service

## Import examples

Runtime client:

```ts
import { prisma } from '@pytholit/db';
```

Prisma types:

```ts
import type { Prisma } from '@pytholit/db';
```

Utility helper:

```ts
import { exclude } from '@pytholit/db';
```
