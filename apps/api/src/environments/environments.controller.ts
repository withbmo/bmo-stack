import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type { Environment, ServerPreset } from '@pytholit/contracts';
import {
  CreateEnvironmentDto,
  CreateEnvironmentSessionDto,
  SetEnvironmentAccessModeDto,
  UpdateEnvironmentDto,
} from '@pytholit/validation/class-validator';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { EnvironmentsService } from './environments.service';
import { EnvironmentsCrudService } from './services/environments-crud.service';

/**
 * REST API for user-owned environments: list, CRUD, lifecycle (start/stop/terminate),
 * terminal and proxy sessions, access mode, and server presets.
 * All routes are under `/api/v1/environments` (global prefix) and require JWT auth
 * except the orchestrator callback, which is @Public() and protected by x-internal-secret.
 */
@Controller('environments')
export class EnvironmentsController {
  constructor(
    private readonly environmentsService: EnvironmentsService,
    private readonly crudService: EnvironmentsCrudService
  ) { }

  @Get()
  async findAll(@CurrentUser('id') userId: string): Promise<Environment[]> {
    return this.crudService.findAll(userId);
  }

  @Get('presets')
  async listPresets(): Promise<ServerPreset[]> {
    return this.environmentsService.listServerPresets();
  }

  /** Return regions that are configured for provisioning (have OrchestratorRegionConfig). Auth: JWT. */
  @Get('regions')
  async listRegions(): Promise<{ region: string }[]> {
    return this.environmentsService.listConfiguredRegions();
  }

  @Get('instance-types')
  async listInstanceTypes(
    @Query('region') region: string,
    @Query('arch') arch: 'x86_64' | 'arm64',
    @Query('q') q?: string,
    @Query('limit') limit?: string
  ): Promise<{ instanceType: string; vcpu: number; memoryMiB: number }[]> {
    return this.environmentsService.listInstanceTypes(region, arch, q, limit);
  }

  /** Return metadata for an exact instance type (fast path; avoids full catalog scan). Auth: JWT. */
  @Get('instance-type')
  async getInstanceType(
    @Query('region') region: string,
    @Query('arch') arch: 'x86_64' | 'arm64',
    @Query('instanceType') instanceType: string
  ): Promise<{ instanceType: string; vcpu: number; memoryMiB: number }> {
    return this.environmentsService.getInstanceType(region, arch, instanceType);
  }

  @Post()
  async create(
    @CurrentUser('id') userId: string,
    @Body() createEnvironmentDto: CreateEnvironmentDto
  ): Promise<Environment> {
    return this.crudService.create(userId, createEnvironmentDto);
  }

  @Get(':id')
  async findOne(@CurrentUser('id') userId: string, @Param('id') id: string): Promise<Environment> {
    return this.crudService.findOne(userId, id);
  }

  @Delete(':id')
  async delete(@CurrentUser('id') userId: string, @Param('id') id: string): Promise<{ message: string }> {
    return this.crudService.delete(userId, id);
  }

  @Patch(':id')
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateEnvironmentDto: UpdateEnvironmentDto
  ): Promise<Environment> {
    return this.crudService.update(userId, id, updateEnvironmentDto);
  }

  @Post(':id/start')
  async startEnvironment(
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ): Promise<{ message: string; status: string }> {
    return this.environmentsService.startEnvironment(userId, id);
  }

  @Post(':id/stop')
  async stopEnvironment(
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ): Promise<{ message: string; status: string }> {
    return this.environmentsService.stopEnvironment(userId, id);
  }

  /** Request termination via env-orchestrator. Auth: JWT. */
  @Post(':id/terminate')
  async terminateEnvironment(
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ): Promise<{ message: string; status: string }> {
    return this.environmentsService.terminateEnvironment(userId, id);
  }

  @Get(':id/status')
  async getStatus(
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ): Promise<{
    environmentId: string;
    status: string;
    state?: string;
    instanceId?: string;
    privateIp?: string;
    ipv6Addresses?: string[];
    region?: string;
    lastUpdated: string;
  }> {
    return this.environmentsService.getEnvironmentStatus(userId, id);
  }

  /** Issue a short-lived JWT and WS URL for the terminal. Auth: JWT. */
  @Post(':id/terminal/session')
  @HttpCode(HttpStatus.OK)
  async createTerminalSession(
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ): Promise<{
    token: string;
    expiresAt: string;
    wsUrl: string;
  }> {
    return this.environmentsService.createTerminalSession(userId, id);
  }

  @Post(':id/proxy/session')
  @HttpCode(HttpStatus.OK)
  async createProxySession(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() body: CreateEnvironmentSessionDto
  ): Promise<{ token: string; expiresAt: string }> {
    return this.environmentsService.createProxySession(userId, id, body?.serviceKey);
  }

  @Get(':id/services')
  async getServices(
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ): Promise<{ key: string; path: string; description?: string }[]> {
    return this.environmentsService.listServiceRoutes(userId, id);
  }

  @Patch(':id/access-mode')
  async setAccessMode(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() body: SetEnvironmentAccessModeDto
  ): Promise<Environment> {
    return this.environmentsService.setAccessMode(userId, id, body?.mode);
  }

  @Post(':id/prod-api-key/rotate')
  async rotateProdApiKey(
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ): Promise<{ apiKey: string; rotatedAt: string }> {
    return this.environmentsService.rotateProdApiKey(userId, id);
  }

  @Post(':id/activity')
  @HttpCode(HttpStatus.OK)
  async recordActivity(
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ): Promise<{ ok: true; environmentId: string; lastActivityAt: string }> {
    const lastActivityAt = await this.environmentsService.recordActivity(userId, id);
    return { ok: true, environmentId: id, lastActivityAt };
  }

  /**
   * Internal callback used by env-orchestrator when EC2 reaches a terminal state (ready, failed, etc.).
   * Auth: x-internal-secret header only; not JWT.
   */
  @Public()
  @Post(':id/orchestrator-status')
  @HttpCode(HttpStatus.OK)
  async orchestratorStatusCallback(
    @Param('id') id: string,
    @Headers('x-internal-secret') secret: string,
    @Body() body: { status: string; details?: Record<string, unknown> }
  ): Promise<{ ok: true }> {
    await this.environmentsService.applyOrchestratorCallback(
      id,
      secret ?? '',
      body.status,
      body.details ?? {}
    );
    return { ok: true };
  }
}
