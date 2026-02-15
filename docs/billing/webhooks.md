# Stripe webhooks

Webhook endpoint: `POST /api/v1/billing/webhook`

Implementation:

- Controller: `apps/api/src/billing/billing.controller.ts`
- Signature verification: `apps/api/src/billing/stripe.service.ts`
- Event handlers + dedupe: `apps/api/src/billing/billing.service.ts`

## Raw body requirement

Stripe signature verification requires the **exact raw request payload**.

The API sets up raw body parsing only for this endpoint in `apps/api/src/main.ts`:

- `express.raw({ type: 'application/json' })` for the webhook path
- normal JSON parsing for everything else

## Required configuration

Environment variables (see `apps/api/src/config/env.ts`):

- `STRIPE_SECRET_KEY`: initializes the Stripe client
- `STRIPE_WEBHOOK_SECRET`: used to validate the `stripe-signature` header

## Deduplication

Before handling, the service records the event id in Postgres:

- Table: `stripe_webhook_events` (`StripeWebhookEvent` model)
- If a duplicate is detected (unique constraint), processing is skipped

This logic is in `BillingService.markStripeEventAsProcessed()`.

## Events handled

From `BillingService.handleWebhookEvent()`:

- `checkout.session.completed`
  - reads `metadata.userId` and `metadata.planId`
  - links Stripe customer to user (best-effort)
  - fetches Stripe subscription and upserts `subscriptions`

- `customer.subscription.created`
- `customer.subscription.updated`
  - upserts `subscriptions` with:
    - normalized status
    - current period start/end
    - cancelAtPeriodEnd
    - inferred `planId` (via subscription metadata or price id mapping)

- `customer.subscription.deleted`
  - sets subscription status to `canceled`

- `invoice.payment_succeeded`
  - upserts `invoices` (amount/status/URLs)

- `invoice.payment_failed`
  - logs a warning (TODO: notify user)

