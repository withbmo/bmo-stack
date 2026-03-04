import type { CanActivate, ExecutionContext } from '@nestjs/common';
import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type Auth, AuthService as NestBetterAuthService } from '@thallesp/nestjs-better-auth';
import type { Request } from 'express';

import type { AuthenticatedUser } from '../auth.types';
import {
  throwAccountInactive,
  throwEmailUnverified,
  throwUnauthenticated,
} from '../errors/auth-errors';

/**
 * Extended Express Request type with Better Auth user and session.
 *
 * This type augments the standard Express Request with properties
 * added by the BetterAuthGuard during authentication.
 */
type GuardRequest = Request & {
  /** Authenticated user object populated by this guard */
  user?: Partial<AuthenticatedUser> & { id?: string };
  /** Better Auth session object */
  session?: unknown;
};

/**
 * Authentication guard that validates sessions using Better Auth.
 *
 * This guard performs two main functions:
 * 1. Validates the session token using Better Auth's session API
 * 2. Enriches the request user with full database user details
 *
 * Guard Chain Order:
 * 1. BetterAuthGuard - Authentication (this guard)
 * 2. AdminEnrichmentGuard - Admin data enrichment
 * 3. CaslAuthorizationGuard - Authorization
 * 4. ThrottlerGuard - Rate limiting
 *
 * @class BetterAuthGuard
 * @implements {CanActivate}
 * @Injectable
 *
 * @see {@link https://docs.nestjs.com/guards NestJS Guards}
 * @see {@link https://www.better-auth.com/docs/concepts/sessions Better Auth Sessions}
 */
@Injectable()
export class BetterAuthGuard implements CanActivate {
  /**
   * Creates an instance of BetterAuthGuard.
   *
   * @param {Reflector} reflector - NestJS reflector for accessing route metadata
   * @param {NestBetterAuthService<Auth>} betterAuthService - Better Auth service instance
   */
  constructor(
    private readonly reflector: Reflector,
    @Inject(NestBetterAuthService)
    private readonly betterAuthService: NestBetterAuthService<Auth>
  ) {}

  /**
   * Determines if the request can proceed based on authentication status.
   *
   * This method implements the core authentication logic:
   * 1. Checks if the route is marked as public (@Public decorator)
   * 2. Validates the session token with Better Auth
   * 3. Uses hydrated Better Auth user fields from session
   * 4. Verifies email verification and account status
   * 5. Enriches the request with normalized user details
   *
   * @param {ExecutionContext} context - NestJS execution context containing the request
   * @returns {Promise<boolean>} True if authentication succeeds, throws otherwise
   * @throws {UnauthorizedException} If no valid session exists (and route is not public)
   * @throws {ForbiddenException} If email is not verified or account is inactive
   *
   * @async
   * @memberof BetterAuthGuard
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('PUBLIC', [
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
