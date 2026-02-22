import type { CanActivate, ExecutionContext } from '@nestjs/common';
import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Prisma } from '@pytholit/db';
import { type Auth, AuthService as NestBetterAuthService } from '@thallesp/nestjs-better-auth';
import type { Request } from 'express';

import { PrismaService } from '../../database/prisma.service';
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

// Loaded dynamically
let _usernameSuffix: () => string;

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
  private readonly logger = new Logger(BetterAuthGuard.name);

  /**
   * Creates an instance of BetterAuthGuard.
   *
   * @param {Reflector} reflector - NestJS reflector for accessing route metadata
   * @param {NestBetterAuthService<Auth>} betterAuthService - Better Auth service instance
   * @param {PrismaService} prisma - Prisma database service for user lookups
   */
  constructor(
    private readonly reflector: Reflector,
    @Inject(NestBetterAuthService)
    private readonly betterAuthService: NestBetterAuthService<Auth>,
    private readonly prisma: PrismaService
  ) { }

  /**
   * Determines if the request can proceed based on authentication status.
   *
   * This method implements the core authentication logic:
   * 1. Checks if the route is marked as public (@Public decorator)
   * 2. Validates the session token with Better Auth
   * 3. Resolves or provisions the user in the database
   * 4. Verifies email verification and account status
   * 5. Enriches the request with full user details
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

      // Attach session to request
      request.session = sessionResult.session;
      request.user = sessionResult.user;

      const userId = sessionResult.user.id;
      if (!userId) {
        return this.allowPublicOrThrow(isPublic);
      }

      // Fetch full user details from database to enrich the request user.
      // If OAuth created a session before a local `users` row exists, provision it.
      const user = await this.resolveOrProvisionUser(sessionResult.user as Record<string, unknown>);

      if (!user) {
        return this.allowPublicOrThrow(isPublic);
      }

      if (!user.isEmailVerified) {
        throwEmailUnverified();
      }

      if (!user.isActive) {
        throwAccountInactive();
      }

      // Enrich request.user with complete profile for use in controllers
      request.user = {
        ...request.user,
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive,
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

  /**
   * Resolves an existing user or provisions a new one from OAuth session data.
   *
   * This method handles the user lookup and creation flow:
   * 1. First attempts to find user by ID from the session
   * 2. Falls back to email lookup (handles OAuth email-based account linking)
   * 3. If no user found and valid data provided, creates a new user record
   * 4. Handles race conditions from parallel OAuth callbacks gracefully
   *
   * @param {Record<string, unknown>} sessionUser - User data from Better Auth session
   * @param {string} [sessionUser.id] - User ID from the authentication provider
   * @param {string} [sessionUser.email] - User email address
   * @param {string} [sessionUser.name] - User display name (optional)
   * @param {boolean} [sessionUser.emailVerified] - Whether email is verified
   * @returns {Promise<ResolvedUser | null>} The resolved/created user, or null if invalid data
   *
   * @private
   * @async
   * @memberof BetterAuthGuard
   *
   * @example
   * ```typescript
   * const user = await this.resolveOrProvisionUser({
   *   id: 'oauth-user-id',
   *   email: 'user@example.com',
   *   name: 'John Doe',
   *   emailVerified: true
   * });
   * ```
   */
  private async resolveOrProvisionUser(sessionUser: Record<string, unknown>) {
    const sessionUserId = typeof sessionUser.id === 'string' ? sessionUser.id : '';
    const sessionEmail = typeof sessionUser.email === 'string' ? sessionUser.email : '';
    const sessionName = typeof sessionUser.name === 'string' ? sessionUser.name.trim() : '';
    const sessionEmailVerified =
      typeof sessionUser.emailVerified === 'boolean' ? sessionUser.emailVerified : false;
    const allowEmailMerge = sessionEmailVerified;

    const select = {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      isEmailVerified: true,
      isActive: true,
    } as const;

    const byId = await this.prisma.client.user.findUnique({
      where: { id: sessionUserId },
      select,
    });
    if (byId) {
      if (sessionEmailVerified && !byId.isEmailVerified) {
        return this.prisma.client.user.update({
          where: { id: byId.id },
          data: { isEmailVerified: true },
          select,
        });
      }
      return byId;
    }

    if (sessionEmail && allowEmailMerge) {
      const byEmail = await this.prisma.client.user.findUnique({
        where: { email: sessionEmail },
        select,
      });
      if (byEmail) {
        if (sessionEmailVerified && !byEmail.isEmailVerified) {
          return this.prisma.client.user.update({
            where: { id: byEmail.id },
            data: { isEmailVerified: true },
            select,
          });
        }
        if (byEmail.id !== sessionUserId) {
          this.logger.log(
            `auth_email_merge_resolved existingUserId=${byEmail.id} sessionUserId=${sessionUserId} email=${sessionEmail}`
          );
        }
        return byEmail;
      }
    } else if (sessionEmail && !allowEmailMerge) {
      this.logger.warn(
        `auth_email_merge_skipped_unverified sessionUserId=${sessionUserId} email=${sessionEmail}`
      );
    }

    if (!sessionUserId || !sessionEmail) return null;

    const [firstName, ...rest] = sessionName ? sessionName.split(/\s+/) : [];
    const lastName = rest.length ? rest.join(' ') : null;
    const createWithUsername = async (username: string) =>
      this.prisma.client.user.create({
        data: {
          id: sessionUserId,
          email: sessionEmail,
          username,
          firstName: firstName || null,
          lastName,
          isEmailVerified: sessionEmailVerified,
          isActive: true,
        },
        select,
      });

    const usernames = [
      await this.generateUniqueUsername(sessionEmail),
      await this.generateUniqueUsername(sessionEmail, true),
      await this.generateUniqueUsername(sessionEmail, true),
    ];

    for (const username of usernames) {
      try {
        return await createWithUsername(username);
      } catch (error) {
        if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
          throw error;
        }

        if (this.isUniqueViolationOn(error, ['id', 'email'])) {
          const byIdFallback = await this.prisma.client.user.findUnique({
            where: { id: sessionUserId },
            select,
          });
          const byEmailFallback = allowEmailMerge
            ? await this.prisma.client.user.findUnique({
              where: { email: sessionEmail },
              select,
            })
            : null;
          const fallback = byIdFallback ?? byEmailFallback;
          if (fallback) {
            // Parallel OAuth callbacks can race on id/email unique keys.
            this.logger.warn(
              `auth_user_provision_race sessionUserId=${sessionUserId} email=${sessionEmail}`
            );
            return fallback;
          }
        }

        if (!this.isUniqueViolationOn(error, ['username'])) {
          throw error;
        }
      }
    }

    this.logger.error(
      `auth_user_provision_username_collision_exhausted sessionUserId=${sessionUserId} email=${sessionEmail}`
    );
    return null;
  }

  /**
   * Generates a unique username from an email address.
   *
   * When this is used:
   * - Called only from `resolveOrProvisionUser(...)`
   * - Runs during first-time OAuth/session provisioning when no local user exists by `id` or `email`
   * - Used to prepare the `username` value for `user.create(...)` attempts
   *
   * This method creates a URL-safe username candidate based on the email's local part:
   * 1. Extracts the local part (before @) from the email
   * 2. Normalizes to an ASCII slug and converts separators to underscores
   * 3. Truncates to 24 characters
   * 4. Uses the base username on the first attempt
   * 5. Appends a random 4-char alphanumeric suffix for collision retries
   *
   * @param {string} email - The email address to generate username from
   * @param {boolean} [withSuffix=false] - Whether to append a random 4-char suffix
   * @returns {string} A username candidate (max 31 characters)
   *
   * @private
   * @memberof BetterAuthGuard
   *
   * @example
   * ```typescript
   * const username1 = this.generateUniqueUsername('john.doe@example.com');
   * // Returns: 'john_doe'
   *
   * const username2 = this.generateUniqueUsername('user@example.com', true);
   * // Returns: 'user_a1b2'
   * ```
   */
  private async generateUniqueUsername(email: string, withSuffix = false): Promise<string> {
    const { default: slugify } = await import('@sindresorhus/slugify');
    if (!_usernameSuffix) {
      const { customAlphabet } = await import('nanoid');
      _usernameSuffix = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 4);
    }
    const local = email.split('@')[0] ?? 'user';
    const sanitized = slugify(local, { separator: '-' })
      .replace(/-/g, '_')
      .replace(/^_+|_+$/g, '');
    const base = (sanitized || 'user').slice(0, 24);
    if (!withSuffix) return base;
    return `${base}_${_usernameSuffix()}`;
  }

  private isUniqueViolationOn(
    error: Prisma.PrismaClientKnownRequestError,
    fields: string[]
  ): boolean {
    const target = error.meta?.target;
    if (typeof target === 'string') {
      return fields.some((field) => target.includes(field));
    }
    if (Array.isArray(target)) {
      return target.some((entry) => typeof entry === 'string' && fields.includes(entry));
    }
    return false;
  }

  private allowPublicOrThrow(isPublic: boolean | undefined): true {
    if (isPublic === true) return true;
    throwUnauthenticated();
  }
}
