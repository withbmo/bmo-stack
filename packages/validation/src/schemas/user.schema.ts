import { z } from 'zod';

export const USER_CONSTANTS = {
  MAX_BIO_LENGTH: 500,
  MAX_FULLNAME_LENGTH: 100,
} as const;

/**
 * Update profile schema
 */
export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name cannot be empty')
    .max(USER_CONSTANTS.MAX_FULLNAME_LENGTH, 'Full name is too long')
    .optional(),
  bio: z.string().max(USER_CONSTANTS.MAX_BIO_LENGTH, 'Bio is too long').optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/**
 * User preferences schema
 */
export const userPreferencesSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
});

export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;
