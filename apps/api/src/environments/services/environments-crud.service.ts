import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Environment } from '@pytholit/contracts';
import {
  ACCESS_MODE,
  ENVIRONMENT_CLASS,
  ENVIRONMENT_REGION,
  ENVIRONMENT_VISIBILITY,
  ORCHESTRATOR_STATUS,
  TIER_POLICY,
} from '@pytholit/contracts';
import { CreateEnvironmentDto, UpdateEnvironmentDto } from '@pytholit/validation/class-validator';

import { PrismaService } from '../../database/prisma.service';
import { MSG_NOT_PROVISIONED } from '../environments.constants';
import { formatEnvironment } from '../environments.utils';

@Injectable()
export class EnvironmentsCrudService {
  constructor(private readonly prisma: PrismaService) { }

  /** Return all environments owned by the user, newest first. Ownership via Prisma filter. */
  async findAll(userId: string): Promise<Environment[]> {
    const environments = await this.prisma.client.environment.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });

    return environments.map(env => formatEnvironment(env));
  }

  /**
   * Create environment for user; unique (ownerId, displayName). Prod envs forced to public.
   * Seeds config with access.mode, orchestrator status unknown. Throws Conflict if displayName exists, BadRequest if prod+private.
   */
  async create(userId: string, createEnvironmentDto: CreateEnvironmentDto): Promise<Environment> {
    const existing = await this.prisma.client.environment.findFirst({
      where: {
        ownerId: userId,
        displayName: createEnvironmentDto.displayName,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Environment with display name "${createEnvironmentDto.displayName}" already exists`
      );
    }

    // Production environments must always be public
    if (
      createEnvironmentDto.environmentClass === ENVIRONMENT_CLASS.PROD &&
      createEnvironmentDto.visibility === ENVIRONMENT_VISIBILITY.PRIVATE
    ) {
      throw new BadRequestException('Production environments must have public visibility');
    }

    const config = {
      ...((createEnvironmentDto.config as Record<string, unknown>) ?? {}),
      environmentClass: createEnvironmentDto.environmentClass,
      access: {
        mode: ACCESS_MODE.SITE_ONLY,
      },
      orchestrator: {
        status: ORCHESTRATOR_STATUS.UNKNOWN,
        ts: new Date().toISOString(),
        message: MSG_NOT_PROVISIONED,
      },
    };

    const now = new Date();
    const created = await this.prisma.client.environment.create({
      data: {
        ownerId: userId,
        envType: createEnvironmentDto.envType,
        displayName: createEnvironmentDto.displayName,
        tierPolicy: createEnvironmentDto.tierPolicy ?? TIER_POLICY.FREE,
        executionMode: createEnvironmentDto.executionMode,
        region: createEnvironmentDto.region ?? ENVIRONMENT_REGION.US_EAST_1,
        visibility:
          createEnvironmentDto.environmentClass === ENVIRONMENT_CLASS.PROD
            ? ENVIRONMENT_VISIBILITY.PUBLIC
            : (createEnvironmentDto.visibility ?? ENVIRONMENT_VISIBILITY.PRIVATE),
        orchestratorStatus: ORCHESTRATOR_STATUS.UNKNOWN,
        orchestratorStatusUpdatedAt: now,
        config,
      },
    });

    return formatEnvironment(created);
  }

  /** Get one environment; 404 if missing, 403 if not owner. Used by controller and DeployJobsService for ownership checks. */
  async findOne(userId: string, environmentId: string): Promise<Environment> {
    const environment = await this.prisma.client.environment.findUnique({
      where: { id: environmentId },
    });

    if (!environment) {
      throw new NotFoundException('Environment not found');
    }

    if (environment.ownerId !== userId) {
      throw new ForbiddenException('Access denied to this environment');
    }

    return formatEnvironment(environment);
  }

  /** Update metadata; enforces ownership via findOne. Throws Conflict if new display name already exists for owner. */
  async update(
    userId: string,
    environmentId: string,
    updateEnvironmentDto: UpdateEnvironmentDto
  ): Promise<Environment> {
    await this.findOne(userId, environmentId);

    if (updateEnvironmentDto.displayName) {
      const existingEnv = await this.prisma.client.environment.findFirst({
        where: {
          ownerId: userId,
          displayName: updateEnvironmentDto.displayName,
          NOT: { id: environmentId },
        },
      });

      if (existingEnv) {
        throw new ConflictException(
          `Environment with display name "${updateEnvironmentDto.displayName}" already exists`
        );
      }
    }

    const updatedEnvironment = await this.prisma.client.environment.update({
      where: { id: environmentId },
      data: updateEnvironmentDto,
    });

    return formatEnvironment(updatedEnvironment);
  }

  /** Delete environment; enforces ownership via findOne before removing the row. */
  async delete(userId: string, environmentId: string): Promise<{ message: string }> {
    await this.findOne(userId, environmentId);
    await this.prisma.client.environment.delete({ where: { id: environmentId } });
    return { message: 'Environment deleted successfully' };
  }
}
