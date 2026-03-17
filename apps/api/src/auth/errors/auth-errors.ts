import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

/** Central helpers for Nest-side auth errors with a consistent `{ code, detail }` shape. */

/** Throw when the request is unauthenticated (HTTP 401, `AUTH_UNAUTHENTICATED`). */
export function throwUnauthenticated(detail = 'Authentication is required.'): never {
  throw new UnauthorizedException({
    code: 'AUTH_UNAUTHENTICATED',
    detail,
  });
}

/** Throw a generic forbidden auth error (HTTP 403) with a custom code. */
export function throwForbidden(code: string, detail: string): never {
  throw new ForbiddenException({
    code,
    detail,
  });
}

/** User must verify their email before proceeding (HTTP 403, `AUTH_EMAIL_UNVERIFIED`). */
export function throwEmailUnverified(): never {
  throwForbidden('AUTH_EMAIL_UNVERIFIED', 'Verify your email before continuing.');
}

/** User account is inactive / disabled (HTTP 403, `AUTH_ACCOUNT_INACTIVE`). */
export function throwAccountInactive(): never {
  throwForbidden('AUTH_ACCOUNT_INACTIVE', 'This account is inactive.');
}
