# Lago Operations Runbook

## Prerequisites
- `LAGO_API_URL` and `LAGO_API_KEY` are configured.
- Lago services are healthy (`lago-api`, `lago-worker`, `lago-db`, `lago-redis`).

## Add a New Plan
1. Open Lago UI.
2. Navigate to Billing > Plans.
3. Create the new plan code and pricing.
4. Add billable metric charges and free units.
5. Validate plan code matches API expectations (example: `pro_monthly`).

## Trigger Invoicing Manually
1. Open Lago UI.
2. Navigate to customer subscriptions.
3. Select subscription and run invoice generation action.
4. Confirm invoice status and Stripe charge result.

## Refund a Customer
1. Open the invoice in Lago UI.
2. Follow Stripe-linked payment reference.
3. Issue refund in Stripe.
4. Add internal note with reason and refund ID.

## Debug Webhook Failures
1. Check API logs for `/billing/webhook/lago` and `/billing/webhook` (credits purchases only).
2. Validate signature headers:
   - Stripe: `stripe-signature`
   - Lago: `x-lago-signature`
3. Check idempotency records in webhook event tables.
4. Replay failed webhooks from Lago/Stripe dashboards.

## Health Checks
- API endpoint reachable at `LAGO_API_URL`.
- Worker queue processing is active (no backlog growth).
- DB and Redis connectivity stable.
- API 5xx rate under threshold alerts.

## Migration Order
1. Deploy API code that no longer depends on `usage_counters` and `stripe_webhook_events`.
2. Apply Prisma migrations:
   - `20260220094000_drop_usage_counters`
   - `20260220095500_drop_stripe_webhook_events`
3. Run `pnpm --filter @pytholit/db db:generate`.
4. Verify `/billing/subscription`, `/billing/invoices`, and `/entitlements/limits` for a Lago-enabled user.
