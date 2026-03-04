import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { DeployJob, DeployJobStep } from '@pytholit/contracts';
import { DEPLOY_JOB_STATUS, DEPLOY_JOB_STEP_STATUS } from '@pytholit/contracts';
import type { Prisma } from '@pytholit/db';
import { CreateDeployJobDto } from '@pytholit/validation/class-validator';

import { DistributedLockService } from '../common/services/distributed-lock.service';
import { PrismaService } from '../database/prisma.service';
import { EnvironmentsCrudService } from '../environments/services/environments-crud.service';
import { ProjectsService } from '../projects/projects.service';

/**
 * Deploy Jobs Service
 * Handles deployment job creation, tracking, and lifecycle management
 */
@Injectable()
export class DeployJobsService {
  private static readonly DEPLOY_CREATE_LOCK_TTL_MS = 30 * 1000;

  private readonly defaultSteps: DeployJobStep[] = [
    { key: 'validate', title: 'Validate config', status: DEPLOY_JOB_STEP_STATUS.QUEUED },
    { key: 'prepare', title: 'Prepare build context', status: DEPLOY_JOB_STEP_STATUS.QUEUED },
    { key: 'mock_build', title: 'Build image (mock)', status: DEPLOY_JOB_STEP_STATUS.QUEUED },
    { key: 'mock_deploy', title: 'Deploy (mock)', status: DEPLOY_JOB_STEP_STATUS.QUEUED },
    { key: 'finalize', title: 'Finalize', status: DEPLOY_JOB_STEP_STATUS.QUEUED },
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly projectsService: ProjectsService,
    private readonly environmentsCrudService: EnvironmentsCrudService,
    private readonly lockService: DistributedLockService
  ) { }

  async create(
    userId: string,
    createDeployJobDto: CreateDeployJobDto
  ): Promise<DeployJob> {
    const lock = await this.lockService.runWithLock(
      this.deployCreateLockResource(createDeployJobDto.environmentId),
      DeployJobsService.DEPLOY_CREATE_LOCK_TTL_MS,
      () => this.createInsideLock(userId, createDeployJobDto)
    );
    if (!lock.acquired) {
      throw new ConflictException('Another deploy job request is already in progress for this environment');
    }
    return lock.result;
  }

  private async createInsideLock(
    userId: string,
    createDeployJobDto: CreateDeployJobDto
  ): Promise<DeployJob> {
    // Verify project ownership
    await this.projectsService.findOne(userId, createDeployJobDto.projectId);

    // Verify environment ownership
    await this.environmentsCrudService.findOne(userId, createDeployJobDto.environmentId);

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
        status: DEPLOY_JOB_STATUS.QUEUED,
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
      await this.environmentsCrudService.findOne(userId, filters.environmentId);
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
    if (
      deployJob.status !== DEPLOY_JOB_STATUS.QUEUED &&
      deployJob.status !== DEPLOY_JOB_STATUS.RUNNING
    ) {
      throw new BadRequestException(
        `Cannot cancel job with status: ${deployJob.status}`
      );
    }

    const updatedJob = await this.prisma.client.deployJob.update({
      where: { id: jobId },
      data: {
        status: DEPLOY_JOB_STATUS.CANCELED,
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
          in: [DEPLOY_JOB_STATUS.QUEUED, DEPLOY_JOB_STATUS.RUNNING],
        },
      },
      data: {
        status: DEPLOY_JOB_STATUS.CANCELED,
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
          envType: job.environment.envType,
          displayName: job.environment.displayName,
        }
        : undefined,
    };
  }

  private deployCreateLockResource(environmentId: string): string {
    return `lock:deploy:create:${environmentId}`;
  }
}
