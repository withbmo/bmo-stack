import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

export type AdminOverviewStats = {
  users: { total: number; active: number };
  environments: { total: number };
  deployJobs: { total: number; failedLast24h: number };
};

@Injectable()
export class AdminOverviewService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(): Promise<AdminOverviewStats> {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [usersTotal, usersActive, envTotal, jobsTotal, jobsFailed24h] =
      await this.prisma.client.$transaction([
        this.prisma.client.user.count(),
        this.prisma.client.user.count({ where: { isActive: true } }),
        this.prisma.client.environment.count(),
        this.prisma.client.deployJob.count(),
        this.prisma.client.deployJob.count({
          where: { status: 'failed', createdAt: { gte: since } },
        }),
      ]);

    return {
      users: { total: usersTotal, active: usersActive },
      environments: { total: envTotal },
      deployJobs: { total: jobsTotal, failedLast24h: jobsFailed24h },
    };
  }
}

