# Billing API

All endpoints are under `api/v1` in `apps/api/src/billing/billing.controller.ts`.

## Public

- `GET /api/v1/billing/plans`
  - Returns active plans from `@pytholit/config`.
- `POST /api/v1/billing/webhook`
  - Stripe webhook endpoint used for credit purchases.
- `POST /api/v1/billing/webhook/lago`
  - Lago webhook endpoint for billing events.

## Authenticated

- `POST /api/v1/billing/checkout`
  - Body: `{ planId: string, interval?: "month" | "year" }`
  - Lago-first subscription flow (rollout-gated).
- `POST /api/v1/billing/portal`
  - Returns Stripe Billing Portal URL for payment method management.
- `GET /api/v1/billing/subscription`
  - Returns current subscription for the user (Lago-backed).
- `GET /api/v1/billing/invoices?limit=10&offset=0`
  - Returns paginated invoices (Lago-backed).
- `GET /api/v1/billing/payment-methods`
  - Returns live Stripe card payment methods.
- `POST /api/v1/billing/validate-card`
  - Body: `{ paymentMethodId: string }`
  - Verifies the card belongs to the current user’s Stripe customer.
- `GET /api/v1/billing/credits`
  - Returns Lago wallet credit balance.
- `POST /api/v1/billing/credits/purchase`
  - Body: `{ amount: number }` in USD.
  - Creates one-time Stripe checkout session and credits Lago wallet on webhook completion.
- `POST /api/v1/billing/usage`
  - Body: `{ metricName: string, value: number }`
  - Sends metered usage events to Lago.
