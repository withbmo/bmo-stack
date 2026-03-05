import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { AdminLevel } from '@pytholit/contracts';
import { Prisma } from '@pytholit/db';

import { isPrismaUniqueViolation } from '../../common/utils/prisma-error.utils';
import { PrismaService } from '../../database/prisma.service';
import type { PageResult } from '../types/page-result';
import { AdminAuditService } from './admin-audit.service';

export type AdminMembershipRow = {
  userId: string;
  email: string;
  username: string;
  level: AdminLevel;
  grantedByUserId: string | null;
  createdAt: string;
  updatedAt: string;
};

@Injectable()
export class AdminMembershipsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AdminAuditService
  ) {}

  async list(params: {
    q?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PageResult<AdminMembershipRow>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 50;

    const where: Prisma.AdminWhereInput = params.q
      ? {
          user: {
            OR: [
              { email: { contains: params.q, mode: 'insensitive' } },
              { username: { contains: params.q, mode: 'insensitive' } },
            ],
          },
        }
      : {};

    const [total, rows] = await this.prisma.client.$transaction([
      this.prisma.client.admin.count({ where }),
      this.prisma.client.admin.findMany({
        where,
        orderBy: [{ level: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          userId: true,
          level: true,
          grantedByUserId: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              email: true,
              username: true,
            },
          },
        },
      }),
    ]);

    return {
      items: rows.map((row) => ({
        userId: row.userId,
        email: row.user.email,
        username: row.user.username ?? '',
        level: row.level,
        grantedByUserId: row.grantedByUserId,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      })),
      total,
      page,
      pageSize,
    };
  }

  async grant(actorUserId: string, userId: string, level: AdminLevel): Promise<AdminMembershipRow> {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) throw new NotFoundException('User not found');

    try {
      const created = await this.prisma.client.admin.create({
        data: {
          userId,
          level,
          grantedByUserId: actorUserId,
        },
        select: {
          userId: true,
          level: true,
          grantedByUserId: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              email: true,
              username: true,
            },
          },
        },
      });

      await this.audit.record({
        actorUserId,
        action: 'admin.memberships.grant',
        targetType: 'admin_membership',
        targetId: userId,
        meta: {
          after: { level: created.level, grantedByUserId: created.grantedByUserId },
        } as unknown as Prisma.InputJsonValue,
      });

      return {
        userId: created.userId,
        email: created.user.email,
        username: created.user.username ?? '',
        level: created.level,
        grantedByUserId: created.grantedByUserId,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      };
    } catch (error) {
      if (isPrismaUniqueViolation(error)) {
        throw new ConflictException('User is already an admin');
      }
      throw error;
    }
  }

  async updateLevel(
    actorUserId: string,
    userId: string,
    level: AdminLevel
  ): Promise<AdminMembershipRow> {
    const before = await this.prisma.client.admin.findUnique({
      where: { userId },
      select: { level: true },
    });
    if (!before) throw new NotFoundException('Admin membership not found');

    const updated = await this.prisma.client.admin.update({
      where: { userId },
      data: { level, grantedByUserId: actorUserId },
      select: {
        userId: true,
        level: true,
        grantedByUserId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            email: true,
            username: true,
          },
        },
      },
    });

    await this.audit.record({
      actorUserId,
      action: 'admin.memberships.update',
      targetType: 'admin_membership',
      targetId: userId,
      meta: {
        before: { level: before.level },
        after: { level: updated.level, grantedByUserId: updated.grantedByUserId },
      } as unknown as Prisma.InputJsonValue,
    });

    return {
      userId: updated.userId,
      email: updated.user.email,
      username: updated.user.username ?? '',
      level: updated.level,
      grantedByUserId: updated.grantedByUserId,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async revoke(actorUserId: string, userId: string): Promise<{ message: string }> {
    const existing = await this.prisma.client.admin.findUnique({
      where: { userId },
      select: { level: true },
    });
    if (!existing) throw new NotFoundException('Admin membership not found');

    await this.prisma.client.admin.delete({
      where: { userId },
    });

    await this.audit.record({
      actorUserId,
      action: 'admin.memberships.revoke',
      targetType: 'admin_membership',
      targetId: userId,
      meta: {
        before: { level: existing.level },
      } as unknown as Prisma.InputJsonValue,
    });

    return { message: 'Admin membership revoked' };
  }
}
