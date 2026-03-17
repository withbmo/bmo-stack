/**
 * Shared project validation constants used by API request DTOs.
 */
export const PROJECT_CONSTANTS = {
  MIN_NAME_LENGTH: 1,
  MAX_NAME_LENGTH: 100,
  MIN_SLUG_LENGTH: 3,
  MAX_SLUG_LENGTH: 50,
  SLUG_REGEX: /^[a-z0-9-]+$/,
} as const;
