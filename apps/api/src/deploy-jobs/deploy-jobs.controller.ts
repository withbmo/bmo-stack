import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
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
    @CurrentUser() user: any,
    @Body() createDeployJobDto: CreateDeployJobDto
  ): Promise<DeployJob> {
    return this.deployJobsService.create(user.id, createDeployJobDto);
  }

  @Get()
  async findAll(
    @CurrentUser() user: any,
    @Query('projectId') projectId?: string,
    @Query('environmentId') environmentId?: string
  ): Promise<DeployJob[]> {
    return this.deployJobsService.findAll(user.id, {
      projectId,
      environmentId,
    });
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: any,
    @Param('id') id: string
  ): Promise<DeployJob> {
    return this.deployJobsService.findOne(user.id, id);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(
    @CurrentUser() user: any,
    @Param('id') id: string
  ): Promise<DeployJob> {
    return this.deployJobsService.cancel(user.id, id);
  }
}
