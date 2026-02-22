# Auth Integration Upgrade Playbook

This API uses `better-auth` with `@thallesp/nestjs-better-auth` and `nest-casl`.

## Pinned versions

- `better-auth`: `1.4.18`
- `@thallesp/nestjs-better-auth`: `2.4.0`
- `nest-casl`: `1.9.15`

## Upgrade steps

1. Update one package at a time and run:
   - `pnpm --filter @pytholit/api build`
   - `pnpm --filter @pytholit/api test`
2. Verify auth boot behavior:
   - `main.ts` keeps `bodyParser: false`
   - Better Auth routes (`/api/v1/auth/*`) bypass app JSON/urlencoded parsers
3. Verify cookie compatibility:
   - `better-auth.session_token`
   - `__Secure-better-auth.session_token`
4. Verify guard behavior:
   - global auth guard still allows anonymous routes via `@Public()`
   - ability checks still enforced on admin routes using `@UseAbility(...)`
5. Confirm no custom compatibility branches remain in guards/controllers.

## Known footguns

- `@thallesp/nestjs-better-auth` assumes Nest body parser is disabled.
- `nest-casl` `AccessGuard` denies routes without ability metadata; the project guard (`CaslAuthorizationGuard`) intentionally allows routes without `@UseAbility`.
- All auth domain enums/constants must live in `@pytholit/contracts`; API DTOs must import allowed values from `@pytholit/validation` constants derived from contracts.
