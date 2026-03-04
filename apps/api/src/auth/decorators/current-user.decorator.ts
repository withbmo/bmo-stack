import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { AuthenticatedUser } from '../auth.types';
import { getPropertyFromUser, getUserFromContext } from './decorator.utils';

/**
 * Parameter decorator to access the authenticated user from the request.
 *
 * Extracts the `user` object from the request (populated by {@link BetterAuthGuard})
 * and injects it into the controller method parameter.
 *
 * By default, it returns the full user object:
 * ```typescript
 * @Get('profile')
 * async getProfile(@CurrentUser() user: AuthenticatedUser) {
 *   return this.usersService.findById(user.id);
 * }
 * ```
 *
 * You can also select a specific user property by key:
 * ```typescript
 * @Get('profile')
 * async getProfile(@CurrentUser('id') userId: string) {
 *   return this.usersService.findById(userId);
 * }
 * ```
 *
 * @param {keyof AuthenticatedUser | undefined} data - Optional property key to select from user
 * @param {ExecutionContext} ctx - NestJS execution context
 * @returns {AuthenticatedUser | AuthenticatedUser[keyof AuthenticatedUser] | undefined}
 * The authenticated user, selected user property, or undefined if unauthenticated
 *
 * @decorator ParameterDecorator
 *
 * @see {@link AuthenticatedUser}
 * @see {@link BetterAuthGuard}
 * @see {@link https://docs.nestjs.com/custom-decorators NestJS Custom Decorators}
 */
export const CurrentUser = createParamDecorator<
  keyof AuthenticatedUser | undefined,
  AuthenticatedUser | AuthenticatedUser[keyof AuthenticatedUser] | undefined
>((data, ctx: ExecutionContext) => {
  if (!data) {
    return getUserFromContext(ctx);
  }
  return getPropertyFromUser(ctx, data);
});

// Re-export type for convenience when importing decorator
export type { AuthenticatedUser } from '../auth.types';
