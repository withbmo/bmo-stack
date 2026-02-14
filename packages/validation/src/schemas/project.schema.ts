import { z } from 'zod';

export const PROJECT_CONSTANTS = {
  MIN_NAME_LENGTH: 1,
  MAX_NAME_LENGTH: 100,
  MIN_SLUG_LENGTH: 3,
  MAX_SLUG_LENGTH: 50,
  SLUG_REGEX: /^[a-z0-9-]+$/,
} as const;

/**
 * Slug validation
 */
const slugSchema = z
  .string()
  .min(PROJECT_CONSTANTS.MIN_SLUG_LENGTH, 'Slug is too short')
  .max(PROJECT_CONSTANTS.MAX_SLUG_LENGTH, 'Slug is too long')
  .regex(PROJECT_CONSTANTS.SLUG_REGEX, 'Slug can only contain lowercase letters, numbers, and hyphens')
  .refine(slug => !slug.startsWith('-') && !slug.endsWith('-'), {
    message: 'Slug cannot start or end with a hyphen',
  });

/**
 * Create project schema
 */
export const createProjectSchema = z.object({
  name: z
    .string({ required_error: 'Project name is required' })
    .min(PROJECT_CONSTANTS.MIN_NAME_LENGTH, 'Project name is required')
    .max(PROJECT_CONSTANTS.MAX_NAME_LENGTH, 'Project name is too long'),
  slug: slugSchema.optional(),
  repoExportEnabled: z.boolean().default(false),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

/**
 * Update project schema
 */
export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(PROJECT_CONSTANTS.MIN_NAME_LENGTH, 'Project name cannot be empty')
    .max(PROJECT_CONSTANTS.MAX_NAME_LENGTH, 'Project name is too long')
    .optional(),
  slug: slugSchema.optional(),
  repoExportEnabled: z.boolean().optional(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
