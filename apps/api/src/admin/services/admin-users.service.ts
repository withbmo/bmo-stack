import { Injectable, NotFoundException } from '@nestjs/common';
import type { AdminLevel } from '@pytholit/contracts';
import type { Prisma } from '@pytholit/db';

import { PrismaService } from '../../database/prisma.service';
import type { PageResult } from '../types/page-result';
import { AdminAuditService } from './admin-audit.service';

export type AdminUserRow = {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isAdmin: boolean;
  adminLevel: AdminLevel | null;
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
          createdAt: true,
        },
      }),
    ]);
    const memberships = await this.prisma.client.admin.findMany({
      where: { userId: { in: users.map(user => user.id) } },
      select: { userId: true, level: true },
    });
    const membershipByUserId = new Map(memberships.map(membership => [membership.userId, membership.level]));

    return {
      items: users.map((u) => ({
        id: u.id,
        email: u.email,
        username: u.username ?? '',
        isActive: u.isActive,
        isEmailVerified: u.isEmailVerified,
        isAdmin: membershipByUserId.has(u.id),
        adminLevel: membershipByUserId.get(u.id) ?? null,
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
    }
  ): Promise<AdminUserRow> {
    const before = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: {
        isActive: true,
      },
    });
    if (!before) throw new NotFoundException('User not found');

    const updated = await this.prisma.client.user.update({
      where: { id: userId },
      data: {
        ...(typeof input.isActive === 'boolean' ? { isActive: input.isActive } : {}),
      },
      select: {
        id: true,
        email: true,
        username: true,
        isActive: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });
    const membership = await this.prisma.client.admin.findUnique({
      where: { userId },
      select: { level: true },
    });

    await this.audit.record({
      actorUserId,
      action: 'admin.users.update',
      targetType: 'user',
      targetId: userId,
      meta: {
        before: {
          isActive: before.isActive,
        },
        after: {
          isActive: updated.isActive,
        },
      } as unknown as Prisma.InputJsonValue,
    });

    return {
      id: updated.id,
      email: updated.email,
      username: updated.username ?? '',
      isActive: updated.isActive,
      isEmailVerified: updated.isEmailVerified,
      isAdmin: !!membership,
      adminLevel: membership?.level ?? null,
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
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const membership = await this.prisma.client.admin.findUnique({
      where: { userId },
      select: { level: true },
    });
    return {
      id: user.id,
      email: user.email,
      username: user.username ?? '',
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      isAdmin: !!membership,
      adminLevel: membership?.level ?? null,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
