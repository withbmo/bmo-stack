import { ExecutionContext } from '@nestjs/common';
import type { AuthenticatedUser } from '../auth.types';

/**
 * Utility function to extract the authenticated user from the request context.
 * Used by param decorators to access request.user.
 *
 * @param ctx - NestJS execution context
 * @returns The authenticated user or undefined if not present
 */
export function getUserFromContext(ctx: ExecutionContext): AuthenticatedUser | undefined {
  const request = ctx.switchToHttp().getRequest<{ user?: AuthenticatedUser }>();
  return request.user;
}

/**
 * Utility function to extract a specific property from the authenticated user.
 *
 * @param ctx - NestJS execution context
 * @param key - Property key to extract from user
 * @returns The selected property value or undefined
 */
export function getPropertyFromUser<K extends keyof AuthenticatedUser>(
  ctx: ExecutionContext,
  key: K
): AuthenticatedUser[K] | undefined {
  const user = getUserFromContext(ctx);
  return user?.[key];
}
