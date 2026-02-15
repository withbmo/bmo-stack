import { Injectable } from '@nestjs/common';
import type { Prisma } from '@pytholit/db';

import { PrismaService } from '../../database/prisma.service';
import type { PageResult } from '../types/page-result';

export type AdminEnvironmentRow = {
  id: string;
  ownerId: string;
  projectId: string | null;
  name: string;
  displayName: string;
  tierPolicy: string;
  executionMode: string;
  region: string;
  visibility: string;
  createdAt: string;
  updatedAt: string;
};

@Injectable()
export class AdminEnvironmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(params: {
    q?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PageResult<AdminEnvironmentRow>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 50;

    const where: Prisma.EnvironmentWhereInput = params.q
      ? {
          OR: [
            { name: { contains: params.q, mode: 'insensitive' } },
            { displayName: { contains: params.q, mode: 'insensitive' } },
            { ownerId: { contains: params.q } },
            { projectId: { contains: params.q } },
          ],
        }
      : {};

    const [total, envs] = await this.prisma.client.$transaction([
      this.prisma.client.environment.count({ where }),
      this.prisma.client.environment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      items: envs.map((e) => ({
        id: e.id,
        ownerId: e.ownerId,
        projectId: e.projectId ?? null,
        name: e.name,
        displayName: e.displayName,
        tierPolicy: e.tierPolicy,
        executionMode: e.executionMode,
        region: e.region,
        visibility: e.visibility,
        createdAt: e.createdAt.toISOString(),
        updatedAt: e.updatedAt.toISOString(),
      })),
      total,
      page,
      pageSize,
    };
  }
}

