# Billing data model (Prisma / Postgres)

Schema: `packages/db/prisma/schema.prisma`

## User billing fields

`users`:

- `stripeCustomerId` (nullable, unique): links a user to a Stripe Customer

## Core billing tables

### `subscriptions`

- `stripeSubscriptionId` (unique)
- `userId` → `users.id` (cascade delete)
- `planId` (nullable): internal plan id (from `@pytholit/config`)
- `status`: `active | canceled | past_due | unpaid | trialing`
- `currentPeriodStart`, `currentPeriodEnd`
- `cancelAtPeriodEnd`

### `invoices`

- `stripeInvoiceId` (unique)
- `userId` → `users.id` (cascade delete)
- `amount` (minor units, e.g. cents), `currency`
- `status`: `draft | open | paid | void | uncollectible`
- `paidAt`, `dueDate`
- `invoiceUrl`, `pdfUrl`

### `payments`

Model exists for recording individual payments:

- `stripePaymentId` (unique)
- `userId` → `users.id` (cascade delete)
- `amount`, `currency`
- `status`: `pending | succeeded | failed | refunded`

Note: current billing implementation persists invoices and subscriptions, but does not upsert `payments` yet.

### `user_payment_methods`

Model exists for persisting payment methods:

- `stripePaymentMethodId` (unique)
- `userId` → `users.id` (cascade delete)
- `type`, `last4`, `brand`, `expiryMonth`, `expiryYear`
- `isDefault`

Note: current billing implementation reads payment methods live from Stripe and returns them, but does not persist them to this table.

### `stripe_webhook_events`

Used for webhook deduplication:

- `id` (primary key): Stripe event id (e.g. `evt_...`)
- `type`

## Entitlements / usage metering

### `usage_counters`

Tracks metered usage per user/feature/period:

- composite unique:
  - `userId`, `featureId`, `periodStart`, `periodEnd`
- `used` increments via `EntitlementsService.recordUsage()`

## How billing relates to environments

There is no direct FK between billing and `environments`.

Relationship is:

- `environments.ownerId` → `users.id`
- user’s effective plan is inferred from `subscriptions` (or default plan)
- entitlements/feature gating can then be applied to environment-related operations.

