import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { AdminLevel } from '@pytholit/contracts';
import type { Request } from 'express';

import { PrismaService } from '../../database/prisma.service';
import type { AuthenticatedUser } from '../../auth/auth.types';

/**
 * Extended request type with admin fields added by this guard.
 */
export type AdminEnrichedRequest = Request & {
  user?: AuthenticatedUser & {
    id: string;
    isAdmin?: boolean;
    adminLevel?: AdminLevel | null;
  };
};

/**
 * Guard that enriches the authenticated user with admin membership details.
 *
 * This guard runs after {@link BetterAuthGuard} and before {@link CaslAuthorizationGuard}.
 * It queries the database for admin membership and adds `isAdmin` and `adminLevel`
 * fields to the request user object for use by CASL authorization.
 *
 * **Guard Chain Order:**
 * 1. BetterAuthGuard - Authentication
 * 2. AdminEnrichmentGuard - Admin data enrichment (this guard)
 * 3. CaslAuthorizationGuard - Authorization
 *
 * @class AdminEnrichmentGuard
 * @Injectable
 *
 * @see {@link BetterAuthGuard}
 * @see {@link CaslAuthorizationGuard}
 */
@Injectable()
export class AdminEnrichmentGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Enriches the request user with admin membership information.
   *
   * @param {ExecutionContext} context - NestJS execution context
   * @returns {Promise<boolean>} Always returns true (this guard never blocks)
   *
   * @async
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AdminEnrichedRequest>();
    const user = request.user;

    // If no authenticated user, skip enrichment
    if (!user?.id) {
      return true;
    }

    // Fetch admin membership via the User model
    const userWithMembership = await this.prisma.client.user.findUnique({
      where: { id: user.id },
      include: {
        adminMembership: {
          select: { level: true },
        },
      },
    });

    // Enrich user object with admin fields
    request.user = {
      ...user,
      isAdmin: !!userWithMembership?.adminMembership,
      adminLevel: userWithMembership?.adminMembership?.level ?? null,
    };

    return true;
  }
}
