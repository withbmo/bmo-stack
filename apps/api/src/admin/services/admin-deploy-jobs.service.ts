import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@pytholit/db';

import { PrismaService } from '../../database/prisma.service';
import type { PageResult } from '../types/page-result';
import { AdminAuditService } from './admin-audit.service';

export type AdminDeployJobRow = {
  id: string;
  status: string;
  projectId: string;
  environmentId: string;
  triggeredByUserId: string | null;
  currentStep: string | null;
  createdAt: string;
};

@Injectable()
export class AdminDeployJobsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AdminAuditService
  ) {}

  async list(params: {
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PageResult<AdminDeployJobRow>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 50;

    const where: Prisma.DeployJobWhereInput = params.status
      ? { status: params.status as any }
      : {};

    const [total, jobs] = await this.prisma.client.$transaction([
      this.prisma.client.deployJob.count({ where }),
      this.prisma.client.deployJob.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          status: true,
          projectId: true,
          environmentId: true,
          triggeredByUserId: true,
          currentStep: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      items: jobs.map((j) => ({
        id: j.id,
        status: j.status,
        projectId: j.projectId,
        environmentId: j.environmentId,
        triggeredByUserId: j.triggeredByUserId ?? null,
        currentStep: j.currentStep ?? null,
        createdAt: j.createdAt.toISOString(),
      })),
      total,
      page,
      pageSize,
    };
  }

  async cancel(actorUserId: string, jobId: string): Promise<{ message: string }> {
    const job = await this.prisma.client.deployJob.findUnique({
      where: { id: jobId },
      select: { id: true, status: true },
    });
    if (!job) throw new NotFoundException('Deploy job not found');
    if (!['queued', 'running'].includes(job.status)) {
      throw new BadRequestException(`Cannot cancel job with status: ${job.status}`);
    }

    await this.prisma.client.deployJob.update({
      where: { id: jobId },
      data: {
        status: 'canceled',
        finishedAt: new Date(),
      },
    });

    await this.audit.record({
      actorUserId,
      action: 'admin.deployJobs.cancel',
      targetType: 'deployJob',
      targetId: jobId,
      meta: { beforeStatus: job.status, afterStatus: 'canceled' } as unknown as Prisma.InputJsonValue,
    });

    return { message: 'Cancel requested' };
  }
}

