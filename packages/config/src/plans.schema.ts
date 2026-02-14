import { z } from 'zod';

export const PlanFeatureValueSchema = z.union([
  z.number(),
  z.boolean(),
  z.string(),
  z.literal('unlimited'),
]);

export const PlanFeatureSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullable(),
  value: PlanFeatureValueSchema,
});

export const PlanSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  displayName: z.string().min(1),
  description: z.string().nullable(),
  monthlyPrice: z.number().min(0),
  yearlyPrice: z.number().min(0),
  stripePriceIdMonthly: z.string().nullable(),
  stripePriceIdYearly: z.string().nullable(),
  features: z.array(PlanFeatureSchema),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

export const PlansSchema = z.array(PlanSchema).min(1);
