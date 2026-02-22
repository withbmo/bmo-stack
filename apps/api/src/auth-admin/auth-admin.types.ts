import type { AdminLevel } from '@pytholit/contracts';

import type { AuthenticatedUser } from '../auth/auth.types';

/**
 * Admin authenticated user type extending the base user with admin properties.
 *
 * This interface represents an admin user with dashboard access and admin level.
 * Used by admin controllers and CASL authorization.
 *
 * @interface AdminAuthenticatedUser
 * @extends AuthenticatedUser
 */
export interface AdminAuthenticatedUser extends AuthenticatedUser {
  /** Whether the user has admin dashboard access */
  isAdmin: true;

  /** Admin level/role for authorization */
  adminLevel: AdminLevel;
}

/**
 * Type guard to check if a user is an admin.
 *
 * @param {AuthenticatedUser | null | undefined} user - The user to check
 * @returns {boolean} True if the user has admin privileges
 */
export function isAdminUser(user: AuthenticatedUser | null | undefined): user is AdminAuthenticatedUser {
  return user !== null && user !== undefined && 'isAdmin' in user && user.isAdmin === true;
}
