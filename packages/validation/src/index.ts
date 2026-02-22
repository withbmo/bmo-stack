/**
 * @pytholit/validation - Shared validation schemas
 *
 * This package provides both Zod schemas (for frontend) and
 * class-validator DTOs (for backend) to ensure validation
 * consistency across the entire application.
 *
 * Usage:
 * - Frontend (Next.js): import from '@pytholit/validation/zod'
 * - Backend (Nest.js): import from '@pytholit/validation/class-validator'
 */

// Export both for convenience
export * from './schemas';
export * from './dtos';
export * from './validators';
export { PASSWORD_STRENGTH_CONFIG } from './config/password-strength.config';
