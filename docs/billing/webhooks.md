# Billing Webhooks

## Endpoints

- `POST /api/v1/billing/webhook` (Stripe)
- `POST /api/v1/billing/webhook/lago` (Lago)

## Stripe webhook (`/billing/webhook`)

Purpose:
- Handle **credit purchase** completion and top up Lago wallet.

Requirements:
- Raw body parsing enabled for this route in `apps/api/src/main.ts`.
- `STRIPE_WEBHOOK_SECRET` must be configured.

Current event handling:
- `checkout.session.completed` with `metadata.credits` and `metadata.userId`:
  - find/create Lago wallet
  - add purchased credits

## Lago webhook (`/billing/webhook/lago`)

Purpose:
- Handle Lago billing lifecycle events.

Requirements:
- `LAGO_WEBHOOK_SECRET` must be configured.
- Signature header: `x-lago-signature`.

Current handler:
- `apps/api/src/billing/lago-webhook.handler.ts`
- Stores event id in `lago_webhook_events` for idempotency.
- Handles:
  - `invoice.paid`
  - `invoice.payment_failed`
  - `subscription.terminated`
