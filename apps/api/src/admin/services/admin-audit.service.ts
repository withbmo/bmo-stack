import { Injectable } from '@nestjs/common';
import type { Prisma } from '@pytholit/db';

import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AdminAuditService {
  constructor(private readonly prisma: PrismaService) {}

  async record(input: {
    actorUserId: string;
    action: string;
    targetType: string;
    targetId?: string | null;
    meta?: Prisma.InputJsonValue;
  }): Promise<void> {
    await this.prisma.client.auditLog.create({
      data: {
        actorUserId: input.actorUserId,
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId ?? null,
        meta: input.meta ?? undefined,
      },
    });
  }
}

