import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getUserFromContext } from '../../auth/decorators/decorator.utils';
import { throwAdminRequired } from '../../auth/errors/auth-errors';
import type { AdminAuthenticatedUser } from '../auth-admin.types';
import { isAdminUser } from '../auth-admin.types';

/**
 * Parameter decorator to access the authenticated admin user from the request.
 *
 * Extracts the `user` object from the request and validates that the user
 * has admin privileges. Throws {@link ForbiddenException} if the user is not an admin.
 *
 * **Usage:**
 * ```typescript
 * @Get('stats')
 * async getStats(@CurrentAdmin() admin: AdminAuthenticatedUser) {
 *   // Guaranteed to be an admin
 *   return this.statsService.getDashboardStats(admin.adminLevel);
 * }
 * ```
 *
 * **Accessing Admin Level:**
 * ```typescript
 * @Patch('users/:id')
 * async updateUser(
 *   @CurrentAdmin() admin: AdminAuthenticatedUser,
 *   @Param('id') id: string,
 * ) {
 *   // admin.adminLevel is available here
 *   if (admin.adminLevel === 'owner') {
 *     // Can do owner-level operations
 *   }
 * }
 * ```
 *
 * @param {unknown} _data - Decorator data (unused, required by NestJS)
 * @param {ExecutionContext} ctx - NestJS execution context
 * @returns {AdminAuthenticatedUser} The authenticated admin user
 * @throws {ForbiddenException} If the user is not authenticated or not an admin
 *
 * @decorator ParameterDecorator
 *
 * @see {@link AdminAuthenticatedUser}
 * @see {@link CaslAuthorizationGuard}
 * @see {@link https://docs.nestjs.com/custom-decorators NestJS Custom Decorators}
 */
export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AdminAuthenticatedUser => {
    const user = getUserFromContext(ctx);

    if (!isAdminUser(user)) {
      throwAdminRequired();
    }

    return user;
  }
);

// Re-export type for convenience when importing decorator
export type { AdminAuthenticatedUser } from '../auth-admin.types';
