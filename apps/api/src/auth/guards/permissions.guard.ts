import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PrismaService } from '../../database/prisma.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { REQUIRED_PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';

const ROLE_BASE_PERMISSIONS: Record<string, string[]> = {
  admin: [
    'admin.access',
    'admin.users.read',
    'admin.users.write',
    'admin.environments.read',
    'admin.environments.write',
    'admin.deployJobs.read',
    'admin.deployJobs.write',
    'admin.billing.read',
    'admin.billing.write',
  ],
  support: [
    'admin.access',
    'admin.users.read',
    'admin.environments.read',
    'admin.deployJobs.read',
  ],
  billing: ['admin.access', 'admin.billing.read'],
  user: [],
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const required =
      this.reflector.getAllAndOverride<string[]>(REQUIRED_PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    // No required permissions => allow.
    if (required.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const authUser = req.user as { id?: string } | undefined;
    const userId = authUser?.id;
    if (!userId) throw new UnauthorizedException('Unauthorized');

    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        isActive: true,
        isEmailVerified: true,
        isSuperuser: true,
        role: true,
        permissions: true,
      },
    });

    if (!user || !user.isActive) throw new UnauthorizedException('Unauthorized');
    if (!user.isEmailVerified) throw new ForbiddenException('Email verification required');
    if (user.isSuperuser) return true;

    const role = (user.role as unknown as string) || 'user';
    const effective = new Set<string>([
      ...(ROLE_BASE_PERMISSIONS[role] || []),
      ...(user.permissions || []),
    ]);

    const missing = required.filter((p) => !effective.has(p));
    if (missing.length > 0) {
      throw new ForbiddenException('Forbidden');
    }

    return true;
  }
}

