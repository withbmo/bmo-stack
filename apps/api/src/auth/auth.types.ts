/**
 * Authenticated user type attached to request by Better Auth.
 *
 * This interface represents the shape of the user object populated
 * by the {@link BetterAuthGuard} and accessed via the {@link CurrentUser}
 * decorator in controller methods.
 *
 * @interface AuthenticatedUser
 * @example
 * ```typescript
 * @Get('profile')
 * async getProfile(@CurrentUser() user: AuthenticatedUser) {
 *   return { id: user.id, email: user.email };
 * }
 * ```
 */
export interface AuthenticatedUser {
  /** Unique identifier for the user (UUID) */
  id: string;

  /** User's email address (unique) */
  email: string;

  /** User's username (unique) */
  username: string;

  /** User's first name (optional) */
  firstName: string | null;

  /** User's last name (optional) */
  lastName: string | null;

  /** Whether the user has verified their email address */
  isEmailVerified: boolean;

  /** Whether the user account is active (not suspended/banned) */
  isActive: boolean;
}
