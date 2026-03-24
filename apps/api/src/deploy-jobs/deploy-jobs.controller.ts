import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import type { DeployJob } from '@pytholit/contracts';

import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { DeployJobsService } from './deploy-jobs.service.js';
import { CreateDeployJobDto } from './dto/create-deploy-job.dto.js';

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
    @Query('projectId') projectId?: string
  ): Promise<DeployJob[]> {
    return this.deployJobsService.findAll(userId, {
      projectId,
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
