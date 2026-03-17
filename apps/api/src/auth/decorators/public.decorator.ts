import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

/**
 * Metadata key written by `AllowAnonymous` (and therefore `Public`) on routes.
 * Shared with `BetterAuthGuard` so both stay in sync.
 */
export const PUBLIC_ROUTE_KEY = 'PUBLIC' as const;

/**
 * Marks a controller or handler as public (no authentication required).
 */
export const Public = AllowAnonymous;
