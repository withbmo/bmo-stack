export const BillingQueue = {
  Name: 'billing',
} as const;

export const BillingJobName = {
  StripeWebhookEvent: 'stripe_webhook_event',
} as const;

export const StripeMetadataKey = {
  IsCreditTopup: 'is_credit_topup',
} as const;
