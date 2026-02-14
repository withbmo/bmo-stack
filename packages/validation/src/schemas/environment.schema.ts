import { z } from 'zod';

/**
 * Environment enums
 */
export const environmentNameSchema = z.enum(['dev', 'staging', 'prod']);
export const executionModeSchema = z.enum(['managed', 'byo_aws']);
export const visibilitySchema = z.enum(['public', 'private']);
export const tierPolicySchema = z.enum(['free', 'pro', 'enterprise']);
export const regionSchema = z.enum(['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1']);
export const environmentClassSchema = z.enum(['dev', 'prod']);

/**
 * Environment config schema
 */
export const environmentConfigSchema = z.object({
  schemaVersion: z.string(),
  presets: z.record(z.unknown()).optional(),
  custom: z.record(z.unknown()).optional(),
});

/**
 * Create environment schema
 */
export const createEnvironmentSchema = z.object({
  projectId: z.string().uuid().optional(),
  name: environmentNameSchema,
  displayName: z
    .string({ required_error: 'Display name is required' })
    .min(1, 'Display name is required')
    .max(100, 'Display name is too long'),
  environmentClass: environmentClassSchema,
  tierPolicy: tierPolicySchema.default('free'),
  executionMode: executionModeSchema.default('managed'),
  region: regionSchema.default('us-east-1'),
  visibility: visibilitySchema.default('private'),
  // Environment config is product-defined and stored as JSONB.
  // Keep this permissive; stricter schemas can be layered in the app.
  config: z.record(z.unknown()).optional(),
});

export type CreateEnvironmentInput = z.infer<typeof createEnvironmentSchema>;

/**
 * Update environment schema
 */
export const updateEnvironmentSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Display name cannot be empty')
    .max(100, 'Display name is too long')
    .optional(),
  executionMode: executionModeSchema.optional(),
  visibility: visibilitySchema.optional(),
  region: regionSchema.optional(),
  config: environmentConfigSchema.optional(),
});

export type UpdateEnvironmentInput = z.infer<typeof updateEnvironmentSchema>;

/**
 * Environment action schema
 */
export const environmentActionSchema = z.object({
  action: z.enum(['start', 'stop', 'terminate']),
});

export type EnvironmentActionInput = z.infer<typeof environmentActionSchema>;
