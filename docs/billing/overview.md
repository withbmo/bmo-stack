# Billing system — overview

Billing is implemented in the **API** (`apps/api`) using **Stripe** for subscriptions and **Postgres** (Prisma) for persistence.

## High-level flow

```mermaid
flowchart TD
  User -->|"POST /api/v1/billing/checkout"| API[apps/api]
  API --> StripeCheckout[Stripe Checkout Session]
  StripeCheckout --> User

  Stripe -->|"POST /api/v1/billing/webhook"| Webhook[BillingController webhook]
  Webhook --> StripeVerify[Stripe signature verify]
  StripeVerify --> BillingSvc[BillingService]
  BillingSvc --> Dedup[StripeWebhookEvent table]
  BillingSvc --> DB[(Postgres via Prisma)]
  DB --> Sub[subscriptions]
  DB --> Inv[invoices]
  DB --> UserTbl[users.stripeCustomerId]

  API --> Entitlements[EntitlementsService]
  Entitlements --> Usage[(usage_counters)]
  Entitlements --> Plans[@pytholit/config plans]
```

## Main components

- **Stripe SDK wrapper**: `apps/api/src/billing/stripe.service.ts`
  - Initializes Stripe with `STRIPE_SECRET_KEY`
  - Constructs webhook events with `STRIPE_WEBHOOK_SECRET`
- **Billing API**: `apps/api/src/billing/billing.controller.ts`
  - Checkout, portal, plans, subscription, invoices, payment methods, usage, webhook
- **Billing logic + webhook handlers**: `apps/api/src/billing/billing.service.ts`
  - Creates Stripe customer, checkout/portal sessions
  - Processes webhook events and upserts subscription/invoice records
  - Dedupes webhook events via `stripe_webhook_events`
- **Entitlements (feature gating / usage metering)**: `apps/api/src/entitlements/entitlements.service.ts`
  - Resolves effective plan from subscription (or defaults)
  - Tracks usage in `usage_counters`

## Environment variables

Defined in `apps/api/src/config/env.ts`:

- `STRIPE_SECRET_KEY`: enables Stripe SDK
- `STRIPE_WEBHOOK_SECRET`: required to validate webhooks
- `FRONTEND_URL`: used to build success/cancel/return URLs
- `ENTITLEMENTS_ENABLED`: enables entitlements API/usage tracking

## What is persisted (today)

From the webhook handlers in `BillingService`:

- **`users.stripeCustomerId`** is set/updated from Stripe customer id
- **`subscriptions`** is upserted on subscription create/update/delete events
- **`invoices`** is upserted on `invoice.payment_succeeded`
- **`stripe_webhook_events`** records event ids for dedupe

`payments` and `user_payment_methods` models exist in Prisma but are not currently written by the billing service (payment methods are fetched live from Stripe in `getUserPaymentMethods()`).

