# Billing API

All endpoints are in the API (`apps/api`) under the global prefix `api/v1` (`apps/api/src/main.ts`).

Controller: `apps/api/src/billing/billing.controller.ts`

## Public

- `GET /api/v1/billing/plans`
  - Lists active plans (from `@pytholit/config`)
- `POST /api/v1/billing/webhook`
  - Stripe webhooks endpoint (requires raw body parsing + signature header)

## Authenticated

- `POST /api/v1/billing/checkout`
  - Body: `{ planId: string, interval?: "month" | "year" }`
  - Returns: `{ sessionId, url }`

- `POST /api/v1/billing/portal`
  - Returns: `{ url }` (Stripe Billing Portal session)

- `GET /api/v1/billing/subscription`
  - Returns: subscription record + resolved plan details, or `null`

- `GET /api/v1/billing/invoices?limit=10&offset=0`
  - Returns: list of invoices from Postgres (not live from Stripe)

- `GET /api/v1/billing/payment-methods`
  - Returns: list of card payment methods from Stripe (live)

- `POST /api/v1/billing/validate-card`
  - Body: `{ paymentMethodId: string }`
  - Validates the payment method belongs to the current user’s Stripe customer

- `POST /api/v1/billing/usage`
  - Body: `{ metricName: string, value: number }`
  - For metered usage; delegates to `EntitlementsService.recordUsage()`
  - Requires `ENTITLEMENTS_ENABLED=true`

