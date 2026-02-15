# Entitlements (plans, limits, usage counters)

Entitlements are the feature-gating layer that sits above billing.

Implementation: `apps/api/src/entitlements/entitlements.service.ts`

## Feature flag

Entitlements are disabled unless:

- `ENTITLEMENTS_ENABLED=true` (see `apps/api/src/config/env.ts`)

If disabled, `EntitlementsService` throws `503 Entitlements are disabled`.

## Plan resolution

The effective plan is resolved per user:

1) Look for most recent subscription where status is in:
   - `active`, `trialing`, `past_due`
2) If `subscription.planId` maps to a configured plan, use it; else fall back to default plan
3) Determine billing period:
   - if subscription has `currentPeriodStart`/`currentPeriodEnd`, use those
   - otherwise default to current calendar month in UTC

Plans come from `@pytholit/config` (`getDefaultPlan`, `getPlanById`).

## Usage counters

Usage is tracked in Postgres table `usage_counters`:

- Keyed by:
  - `userId`, `featureId`, `periodStart`, `periodEnd`
- `used` is incremented on each `recordUsage()` call

## APIs that consume entitlements

- Billing controller calls:
  - `POST /api/v1/billing/usage` → `EntitlementsService.recordUsage(userId, metricName, value)`

Other product flows can call:

- `EntitlementsService.canConsume(userId, featureId, amount)`
- `EntitlementsService.recordUsage(userId, featureId, amount)`

to enforce limits (e.g. “environments created”, “build minutes”, etc.) based on plan features.

