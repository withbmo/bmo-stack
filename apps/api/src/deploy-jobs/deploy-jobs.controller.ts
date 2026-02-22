import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import type { DeployJob } from '@pytholit/contracts';
import { CreateDeployJobDto } from '@pytholit/validation/class-validator';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { DeployJobsService } from './deploy-jobs.service';

/**
 * Deploy Jobs Controller
 * Handles deployment job endpoints
 */
@Controller('deploy-jobs')
export class DeployJobsController {
  constructor(private readonly deployJobsService: DeployJobsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser('id') userId: string,
    @Body() createDeployJobDto: CreateDeployJobDto
  ): Promise<DeployJob> {
    return this.deployJobsService.create(userId, createDeployJobDto);
  }

  @Get()
  async findAll(
    @CurrentUser('id') userId: string,
    @Query('projectId') projectId?: string,
    @Query('environmentId') environmentId?: string
  ): Promise<DeployJob[]> {
    return this.deployJobsService.findAll(userId, {
      projectId,
      environmentId,
    });
  }

  @Get(':id')
  async findOne(
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ): Promise<DeployJob> {
    return this.deployJobsService.findOne(userId, id);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ): Promise<DeployJob> {
    return this.deployJobsService.cancel(userId, id);
  }
}
