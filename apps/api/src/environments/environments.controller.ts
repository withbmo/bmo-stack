import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EnvironmentsService } from './environments.service';
import {
  CreateEnvironmentDto,
  CreateEnvironmentSessionDto,
  SetEnvironmentAccessModeDto,
  UpdateEnvironmentDto,
} from '@pytholit/validation/class-validator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { Environment } from '@pytholit/contracts';

@Controller('environments')
export class EnvironmentsController {
  constructor(private readonly environmentsService: EnvironmentsService) {}

  @Get()
  async findAll(@CurrentUser() user: any): Promise<Environment[]> {
    return this.environmentsService.findAll(user.id);
  }

  @Post()
  async create(
    @CurrentUser() user: any,
    @Body() createEnvironmentDto: CreateEnvironmentDto
  ): Promise<Environment> {
    return this.environmentsService.create(user.id, createEnvironmentDto);
  }

  @Get(':id')
  async findOne(@CurrentUser() user: any, @Param('id') id: string): Promise<Environment> {
    return this.environmentsService.findOne(user.id, id);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateEnvironmentDto: UpdateEnvironmentDto
  ): Promise<Environment> {
    return this.environmentsService.update(user.id, id, updateEnvironmentDto);
  }

  @Post(':id/start')
  async startEnvironment(
    @CurrentUser() user: any,
    @Param('id') id: string
  ): Promise<{ message: string; status: string }> {
    return this.environmentsService.startEnvironment(user.id, id);
  }

  @Post(':id/stop')
  async stopEnvironment(
    @CurrentUser() user: any,
    @Param('id') id: string
  ): Promise<{ message: string; status: string }> {
    return this.environmentsService.stopEnvironment(user.id, id);
  }

  @Post(':id/terminate')
  async terminateEnvironment(
    @CurrentUser() user: any,
    @Param('id') id: string
  ): Promise<{ message: string; status: string }> {
    return this.environmentsService.terminateEnvironment(user.id, id);
  }

  @Get(':id/status')
  async getStatus(@CurrentUser() user: any, @Param('id') id: string): Promise<{
    environmentId: string;
    status: string;
    state?: string;
    instanceId?: string;
    privateIp?: string;
    ipv6Addresses?: string[];
    region?: string;
    lastUpdated: string;
  }> {
    return this.environmentsService.getEnvironmentStatus(user.id, id);
  }

  @Post(':id/terminal/session')
  @HttpCode(HttpStatus.OK)
  async createTerminalSession(
    @CurrentUser() user: any,
    @Param('id') id: string
  ): Promise<{
    token: string;
    expiresAt: string;
    wsUrl: string;
  }> {
    return this.environmentsService.createTerminalSession(user.id, id);
  }

  @Post(':id/proxy/session')
  @HttpCode(HttpStatus.OK)
  async createProxySession(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: CreateEnvironmentSessionDto
  ): Promise<{ token: string; expiresAt: string }> {
    return this.environmentsService.createProxySession(user.id, id, body?.serviceKey);
  }

  @Get(':id/services')
  async getServices(
    @CurrentUser() user: any,
    @Param('id') id: string
  ): Promise<{ key: string; path: string; description?: string }[]> {
    return this.environmentsService.listServiceRoutes(user.id, id);
  }

  @Patch(':id/access-mode')
  async setAccessMode(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: SetEnvironmentAccessModeDto
  ): Promise<Environment> {
    return this.environmentsService.setAccessMode(user.id, id, body?.mode);
  }

  @Post(':id/prod-api-key/rotate')
  async rotateProdApiKey(
    @CurrentUser() user: any,
    @Param('id') id: string
  ): Promise<{ apiKey: string; rotatedAt: string }> {
    return this.environmentsService.rotateProdApiKey(user.id, id);
  }

  @Post(':id/activity')
  @HttpCode(HttpStatus.OK)
  async recordActivity(
    @CurrentUser() user: any,
    @Param('id') id: string
  ): Promise<{ ok: true; environmentId: string; lastActivityAt: string }> {
    const lastActivityAt = await this.environmentsService.recordActivity(user.id, id);
    return { ok: true, environmentId: id, lastActivityAt };
  }
}
