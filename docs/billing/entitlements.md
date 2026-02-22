# Entitlements

Entitlements are enforced in `apps/api/src/entitlements/entitlements.service.ts`.

## Feature flag

- `ENTITLEMENTS_ENABLED=true` enables entitlements APIs.

## Lago rollout gate

- Entitlements are Lago-backed only when `BillingConfigService.shouldUseLago(userId)` is true.
- If Lago is not enabled for the user, entitlements APIs return unavailable for that account.

## Plan resolution

- Effective plan is resolved from the latest active/trialing/past_due subscription row.
- If no valid subscription is found, default plan is used.

## Usage checks

- `canConsume` reads current metric usage from Lago.
- `recordUsage` sends usage events to Lago.
- `getLimits` computes remaining limits from plan features + Lago usage.

## Metric mapping

- `deployments` → `deployments_monthly`
- `projects` → `projects`
- `environments` → `environments`
- `storage` → `storage_gb`
