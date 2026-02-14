import { z } from 'zod';

/**
 * Billing schemas
 */
export const billingIntervalSchema = z.enum(['month', 'year']);

export const createCheckoutSessionSchema = z.object({
  // Plan IDs are string keys from the app config (e.g. free|pro|enterprise)
  planId: z.string().min(1, 'Plan ID is required'),
  interval: billingIntervalSchema,
});

export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>;

export const validateCardSchema = z.object({
  paymentMethodId: z.string().min(1, 'Payment method ID is required'),
});

export type ValidateCardInput = z.infer<typeof validateCardSchema>;
