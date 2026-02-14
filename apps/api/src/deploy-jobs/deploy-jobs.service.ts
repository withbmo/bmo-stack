import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { DeployJob, DeployJobStep } from '@pytholit/contracts';
import type { Prisma } from '@pytholit/db';
import { CreateDeployJobDto } from '@pytholit/validation/class-validator';

import { PrismaService } from '../database/prisma.service';
import { EnvironmentsService } from '../environments/environments.service';
import { ProjectsService } from '../projects/projects.service';

/**
 * Deploy Jobs Service
 * Handles deployment job creation, tracking, and lifecycle management
 */
@Injectable()
export class DeployJobsService {
  private readonly defaultSteps: DeployJobStep[] = [
    { key: 'validate', title: 'Validate config', status: 'queued' },
    { key: 'prepare', title: 'Prepare build context', status: 'queued' },
    { key: 'mock_build', title: 'Build image (mock)', status: 'queued' },
    { key: 'mock_deploy', title: 'Deploy (mock)', status: 'queued' },
    { key: 'finalize', title: 'Finalize', status: 'queued' },
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly projectsService: ProjectsService,
    private readonly environmentsService: EnvironmentsService
  ) {}

  async create(
    userId: string,
    createDeployJobDto: CreateDeployJobDto
  ): Promise<DeployJob> {
    // Verify project ownership
    await this.projectsService.findOne(userId, createDeployJobDto.projectId);

    // Verify environment ownership
    await this.environmentsService.findOne(userId, createDeployJobDto.environmentId);

    // Get environment execution mode for snapshot
    const environment = await this.prisma.client.environment.findUnique({
      where: { id: createDeployJobDto.environmentId },
    });

    if (!environment) {
      throw new NotFoundException('Environment not found');
    }

    // Auto-cancel any active jobs for this environment
    await this.autoCancelActiveJobs(createDeployJobDto.environmentId);

    // Create deploy job
    const deployJob = await this.prisma.client.deployJob.create({
      data: {
        projectId: createDeployJobDto.projectId,
        environmentId: createDeployJobDto.environmentId,
        triggeredByUserId: userId,
        status: 'queued',
        currentStep: null,
        steps: this.defaultSteps as unknown as Prisma.InputJsonValue,
        source: (createDeployJobDto.source ?? { origin: 'manual', ref: 'main' }) as unknown as Prisma.InputJsonValue,
        executionModeSnapshot: environment.executionMode,
      },
    });

    return this.formatDeployJob(deployJob);
  }

  async findAll(
    userId: string,
    filters?: {
      projectId?: string;
      environmentId?: string;
    }
  ): Promise<DeployJob[]> {
    const where: any = {
      triggeredByUserId: userId,
    };

    if (filters?.projectId) {
      // Verify project ownership first
      await this.projectsService.findOne(userId, filters.projectId);
      where.projectId = filters.projectId;
    }

    if (filters?.environmentId) {
      // Verify environment ownership first
      await this.environmentsService.findOne(userId, filters.environmentId);
      where.environmentId = filters.environmentId;
    }

    const deployJobs = await this.prisma.client.deployJob.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        project: true,
        environment: true,
      },
    });

    return deployJobs.map((job) => this.formatDeployJob(job));
  }

  async findOne(userId: string, jobId: string): Promise<DeployJob> {
    const deployJob = await this.prisma.client.deployJob.findUnique({
      where: { id: jobId },
      include: {
        project: true,
        environment: true,
      },
    });

    if (!deployJob) {
      throw new NotFoundException('Deploy job not found');
    }

    // Verify user owns the project
    if (deployJob.triggeredByUserId !== userId) {
      throw new ForbiddenException('Access denied to this deploy job');
    }

    return this.formatDeployJob(deployJob);
  }

  async cancel(userId: string, jobId: string): Promise<DeployJob> {
    // Verify ownership
    const deployJob = await this.findOne(userId, jobId);

    // Can only cancel queued or running jobs
    if (!['queued', 'running'].includes(deployJob.status)) {
      throw new BadRequestException(
        `Cannot cancel job with status: ${deployJob.status}`
      );
    }

    const updatedJob = await this.prisma.client.deployJob.update({
      where: { id: jobId },
      data: {
        status: 'canceled',
        finishedAt: new Date(),
      },
      include: {
        project: true,
        environment: true,
      },
    });

    return this.formatDeployJob(updatedJob);
  }

  /**
   * Auto-cancel any active (queued or running) jobs for an environment
   */
  private async autoCancelActiveJobs(environmentId: string): Promise<void> {
    await this.prisma.client.deployJob.updateMany({
      where: {
        environmentId,
        status: {
          in: ['queued', 'running'],
        },
      },
      data: {
        status: 'canceled',
        finishedAt: new Date(),
      },
    });
  }

  private formatDeployJob(job: any): DeployJob {
    return {
      id: job.id,
      projectId: job.projectId,
      environmentId: job.environmentId,
      triggeredByUserId: job.triggeredByUserId,
      status: job.status,
      currentStep: job.currentStep,
      steps: job.steps as DeployJobStep[],
      source: job.source,
      executionModeSnapshot: job.executionModeSnapshot,
      createdAt: job.createdAt.toISOString(),
      startedAt: job.startedAt?.toISOString() || null,
      finishedAt: job.finishedAt?.toISOString() || null,
      project: job.project
        ? {
            name: job.project.name,
            slug: job.project.slug,
          }
        : undefined,
      environment: job.environment
        ? {
            name: job.environment.name,
            displayName: job.environment.displayName,
          }
        : undefined,
    };
  }
}
