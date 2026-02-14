import { z } from 'zod';

/**
 * Deployment source schemas
 */
const gitSourceSchema = z.object({
  type: z.literal('git'),
  gitUrl: z.string().url('Invalid Git URL'),
  gitBranch: z.string().min(1, 'Git branch is required'),
  gitCommit: z.string().optional(),
});

const uploadSourceSchema = z.object({
  type: z.literal('upload'),
  uploadPath: z.string().min(1, 'Upload path is required'),
});

const templateSourceSchema = z.object({
  type: z.literal('template'),
  templateId: z.string().uuid('Invalid template ID'),
});

export const deploymentSourceSchema = z.discriminatedUnion('type', [
  gitSourceSchema,
  uploadSourceSchema,
  templateSourceSchema,
]);

/**
 * Create deployment schema
 */
export const createDeploymentSchema = z.object({
  environmentId: z.string().uuid('Invalid environment ID'),
  source: deploymentSourceSchema,
});

export type CreateDeploymentInput = z.infer<typeof createDeploymentSchema>;
