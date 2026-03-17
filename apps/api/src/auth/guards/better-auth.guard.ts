import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type Auth, AuthService as NestBetterAuthService } from '@thallesp/nestjs-better-auth';
import type { Request } from 'express';

import type { AuthenticatedUser } from '../auth.types.js';
import { PUBLIC_ROUTE_KEY } from '../decorators/public.decorator.js';
import {
  throwAccountInactive,
  throwEmailUnverified,
  throwUnauthenticated,
} from '../errors/auth-errors.js';

/**
 * Express request extended with the user and session attached by this guard.
 */
type GuardRequest = Request & {
  user?: Partial<AuthenticatedUser> & { id?: string };
  session?: unknown;
};

/**
 * Global auth guard that validates Better Auth sessions and normalizes `request.user`.
 */
@Injectable()
export class BetterAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(NestBetterAuthService)
    private readonly betterAuthService: NestBetterAuthService<Auth>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<GuardRequest>();

    try {
      // Get the auth instance from the service
      const auth = this.betterAuthService.instance;

      // Get session using the auth instance's API
      const sessionResult = await auth.api.getSession({
        headers: request.headers,
      });

      // If no session and not public, deny access
      if (!sessionResult?.user) {
        return this.allowPublicOrThrow(isPublic);
      }

      const sessionUser = sessionResult.user as Record<string, unknown>;
      const userId = typeof sessionUser.id === 'string' ? sessionUser.id : '';
      const email = typeof sessionUser.email === 'string' ? sessionUser.email : '';
      if (!userId || !email) {
        return this.allowPublicOrThrow(isPublic);
      }

      const isEmailVerified = sessionUser.emailVerified === true;
      const isActive = sessionUser.isActive !== false;
      const username =
        typeof sessionUser.username === 'string' && sessionUser.username.length > 0
          ? sessionUser.username
          : 'user';
      const firstName = typeof sessionUser.firstName === 'string' ? sessionUser.firstName : null;
      const lastName = typeof sessionUser.lastName === 'string' ? sessionUser.lastName : null;

      if (!isEmailVerified) {
        throwEmailUnverified();
      }

      if (!isActive) {
        throwAccountInactive();
      }

      // Attach normalized user/session shape to request for downstream consumers
      request.session = sessionResult.session;
      // Enrich request.user with complete profile for use in controllers
      request.user = {
        id: userId,
        email,
        username,
        firstName,
        lastName,
        isEmailVerified,
        isActive,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
        throw error;
      }
      // If session validation fails and route is public, allow access
      if (isPublic === true) {
        return true;
      }
      throwUnauthenticated();
    }
  }

  private allowPublicOrThrow(isPublic: boolean | undefined): true {
    if (isPublic === true) return true;
    throwUnauthenticated();
  }
}
