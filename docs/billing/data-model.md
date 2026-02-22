# Billing Data Model

Schema source: `packages/db/prisma/schema.prisma`

## User billing fields

`users` table:
- `stripe_customer_id` (nullable): Stripe customer for portal/payment method flows
- `lago_customer_id` (nullable): Lago customer reference
- `lago_wallet_id` (nullable): Lago wallet reference

## Billing tables currently used

- `lago_webhook_events`
  - Idempotency tracking for Lago webhooks
  - Optional `user_id` reference

## Legacy-compatible tables still present

- `subscriptions`
- `invoices`
- `payments`
- `user_payment_methods`

These remain in schema for compatibility, but core billing behavior is Lago-first.

## Removed tables

- `usage_counters` removed via migration `20260220094000_drop_usage_counters`
- `stripe_webhook_events` removed via migration `20260220095500_drop_stripe_webhook_events`
