import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@pytholit/db';

import { PrismaService } from '../../database/prisma.service';
import { AdminAuditService } from './admin-audit.service';
import type { PageResult } from '../types/page-result';

export type AdminUserRow = {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isSuperuser: boolean;
  role: string | null;
  permissions: string[];
  createdAt: string;
};

@Injectable()
export class AdminUsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AdminAuditService
  ) {}

  async list(params: {
    q?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PageResult<AdminUserRow>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 50;

    const where: Prisma.UserWhereInput = params.q
      ? {
          OR: [
            { email: { contains: params.q, mode: 'insensitive' } },
            { username: { contains: params.q, mode: 'insensitive' } },
          ],
        }
      : {};

    const [total, users] = await this.prisma.client.$transaction([
      this.prisma.client.user.count({ where }),
      this.prisma.client.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          email: true,
          username: true,
          isActive: true,
          isEmailVerified: true,
          isSuperuser: true,
          role: true,
          permissions: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      items: users.map((u) => ({
        id: u.id,
        email: u.email,
        username: u.username,
        isActive: u.isActive,
        isEmailVerified: u.isEmailVerified,
        isSuperuser: u.isSuperuser,
        role: (u.role as unknown as string) ?? null,
        permissions: u.permissions ?? [],
        createdAt: u.createdAt.toISOString(),
      })),
      total,
      page,
      pageSize,
    };
  }

  async updateUser(
    actorUserId: string,
    userId: string,
    input: {
      isActive?: boolean;
      isSuperuser?: boolean;
      role?: 'user' | 'admin' | 'support' | 'billing';
      permissions?: string[];
    }
  ): Promise<AdminUserRow> {
    const before = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: {
        isActive: true,
        isSuperuser: true,
        role: true,
        permissions: true,
      },
    });
    if (!before) throw new NotFoundException('User not found');

    const updated = await this.prisma.client.user.update({
      where: { id: userId },
      data: {
        ...(typeof input.isActive === 'boolean' ? { isActive: input.isActive } : {}),
        ...(typeof input.isSuperuser === 'boolean' ? { isSuperuser: input.isSuperuser } : {}),
        ...(typeof input.role === 'string' ? { role: input.role as any } : {}),
        ...(Array.isArray(input.permissions) ? { permissions: input.permissions } : {}),
      },
      select: {
        id: true,
        email: true,
        username: true,
        isActive: true,
        isEmailVerified: true,
        isSuperuser: true,
        role: true,
        permissions: true,
        createdAt: true,
      },
    });

    await this.audit.record({
      actorUserId,
      action: 'admin.users.update',
      targetType: 'user',
      targetId: userId,
      meta: {
        before: {
          isActive: before.isActive,
          isSuperuser: before.isSuperuser,
          role: before.role,
          permissions: before.permissions,
        },
        after: {
          isActive: updated.isActive,
          isSuperuser: updated.isSuperuser,
          role: updated.role,
          permissions: updated.permissions,
        },
      } as unknown as Prisma.InputJsonValue,
    });

    return {
      id: updated.id,
      email: updated.email,
      username: updated.username,
      isActive: updated.isActive,
      isEmailVerified: updated.isEmailVerified,
      isSuperuser: updated.isSuperuser,
      role: (updated.role as unknown as string) ?? null,
      permissions: updated.permissions ?? [],
      createdAt: updated.createdAt.toISOString(),
    };
  }

  async findById(userId: string): Promise<AdminUserRow> {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        isActive: true,
        isEmailVerified: true,
        isSuperuser: true,
        role: true,
        permissions: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      isSuperuser: user.isSuperuser,
      role: (user.role as unknown as string) ?? null,
      permissions: user.permissions ?? [],
      createdAt: user.createdAt.toISOString(),
    };
  }
}

