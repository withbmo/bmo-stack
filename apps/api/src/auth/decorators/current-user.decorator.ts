import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { AuthenticatedUser } from '../auth.types.js';

function getUserFromContext(ctx: ExecutionContext): AuthenticatedUser | undefined {
  const request = ctx.switchToHttp().getRequest<{ user?: AuthenticatedUser }>();
  return request.user;
}

function getPropertyFromUser<K extends keyof AuthenticatedUser>(
  ctx: ExecutionContext,
  key: K
): AuthenticatedUser[K] | undefined {
  return getUserFromContext(ctx)?.[key];
}

/**
 * Access the authenticated user from `request.user`.
 *
 * - `@CurrentUser()` injects the whole `AuthenticatedUser`
 * - `@CurrentUser('id')` injects a single field
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
;
