import { z } from 'zod';
import { PLAN_IDS } from '@pytholit/contracts';

export const PlanFeatureValueSchema = z.union([
  z.number(),
  z.boolean(),
  z.string().refine((value) => value.trim().toLowerCase() !== 'unlimited', {
    message: '"unlimited" is not allowed',
  }),
]);

export const PlanFeatureSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullable(),
  type: z.enum(['number', 'boolean', 'string']),
  value: PlanFeatureValueSchema,
}).superRefine((feature, ctx) => {
  const actualType = typeof feature.value;
  if (feature.type !== actualType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `feature.type must match value type (${actualType})`,
      path: ['type'],
    });
  }
});

const PlanVariantSchema = z.object({
  code: z.string().min(1),
  price: z.number().min(0),
  includedCredits: z.number().int().min(0).default(0),
  bonusCredits: z.number().int().min(0).default(0),
});

export const PlanSchema = z.object({
  version: z.number().int().positive(),
  id: z.enum(PLAN_IDS),
  rank: z.number().int().min(0),
  name: z.string().min(1),
  displayName: z.string().min(1),
  description: z.string().nullable(),
  currency: z.literal('USD').default('USD'),
  billing: z.object({
    monthly: PlanVariantSchema,
    yearly: PlanVariantSchema,
  }),
  features: z.array(PlanFeatureSchema),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

export const PlansSchema = z.array(PlanSchema).min(1);
