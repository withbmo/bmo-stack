import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

/**
 * Throws an UnauthorizedException with consistent error structure
 * Used when user is not authenticated
 */
export function throwUnauthenticated(detail = 'Authentication is required.'): never {
  throw new UnauthorizedException({
    code: 'AUTH_UNAUTHENTICATED',
    detail,
  });
}

/**
 * Throws a ForbiddenException with consistent error structure
 * Used when user is authenticated but not authorized
 */
export function throwForbidden(code: string, detail: string): never {
  throw new ForbiddenException({
    code,
    detail,
  });
}

/**
 * Throws a ForbiddenException for email verification requirement
 */
export function throwEmailUnverified(): never {
  throwForbidden('AUTH_EMAIL_UNVERIFIED', 'Verify your email before continuing.');
}

/**
 * Throws a ForbiddenException for inactive accounts
 */
export function throwAccountInactive(): never {
  throwForbidden('AUTH_ACCOUNT_INACTIVE', 'This account is inactive.');
}

/**
 * Throws a ForbiddenException for admin access requirement
 */
export function throwAdminRequired(): never {
  throwForbidden('AUTH_ADMIN_REQUIRED', 'Admin access required');
}
