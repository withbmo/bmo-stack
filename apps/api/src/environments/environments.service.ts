import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Environment } from '@pytholit/contracts';
import {
  CreateEnvironmentDto,
  UpdateEnvironmentDto,
} from '@pytholit/validation/class-validator';
import { createHash, randomBytes } from 'crypto';

import { PrismaService } from '../database/prisma.service';

type OrchestratorStatus =
  | 'queued'
  | 'starting'
  | 'ready'
  | 'stopping'
  | 'stopped'
  | 'terminating'
  | 'terminated'
  | 'failed'
  | 'unknown';

@Injectable()
export class EnvironmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async findAll(userId: string): Promise<Environment[]> {
    const environments = await this.prisma.client.environment.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });

    return environments.map((env) => this.formatEnvironment(env));
  }

  async create(userId: string, createEnvironmentDto: CreateEnvironmentDto): Promise<Environment> {
    const existing = await this.prisma.client.environment.findFirst({
      where: {
        ownerId: userId,
        name: createEnvironmentDto.name,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Environment with name "${createEnvironmentDto.name}" already exists`
      );
    }

    const config = {
      ...((createEnvironmentDto.config as Record<string, unknown>) ?? {}),
      environmentClass: createEnvironmentDto.environmentClass,
      access: {
        mode: 'site_only',
      },
      orchestrator: {
        status: 'unknown',
        ts: new Date().toISOString(),
        message: 'Not provisioned yet',
      },
    };

    const created = await this.prisma.client.environment.create({
      data: {
        ownerId: userId,
        name: createEnvironmentDto.name,
        displayName: createEnvironmentDto.displayName,
        tierPolicy: createEnvironmentDto.tierPolicy ?? 'free',
        executionMode: createEnvironmentDto.executionMode,
        region: createEnvironmentDto.region ?? 'us-east-1',
        visibility: createEnvironmentDto.visibility ?? 'private',
        config,
      },
    });

    return this.formatEnvironment(created);
  }

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

    return this.formatEnvironment(environment);
  }

  async update(
    userId: string,
    environmentId: string,
    updateEnvironmentDto: UpdateEnvironmentDto
  ): Promise<Environment> {
    await this.findOne(userId, environmentId);

    if (updateEnvironmentDto.name) {
      const existingEnv = await this.prisma.client.environment.findFirst({
        where: {
          ownerId: userId,
          name: updateEnvironmentDto.name,
          NOT: { id: environmentId },
        },
      });

      if (existingEnv) {
        throw new ConflictException(
          `Environment with name "${updateEnvironmentDto.name}" already exists`
        );
      }
    }

    const updatedEnvironment = await this.prisma.client.environment.update({
      where: { id: environmentId },
      data: updateEnvironmentDto,
    });

    return this.formatEnvironment(updatedEnvironment);
  }

  async startEnvironment(
    userId: string,
    environmentId: string
  ): Promise<{ message: string; status: string }> {
    await this.updateOrchestrator(userId, environmentId, {
      status: 'starting',
      message: 'Environment start requested',
    });

    return { message: 'Environment start requested', status: 'starting' };
  }

  async stopEnvironment(
    userId: string,
    environmentId: string
  ): Promise<{ message: string; status: string }> {
    await this.updateOrchestrator(userId, environmentId, {
      status: 'stopping',
      message: 'Environment stop requested',
    });

    return { message: 'Environment stop requested', status: 'stopping' };
  }

  async terminateEnvironment(
    userId: string,
    environmentId: string
  ): Promise<{ message: string; status: string }> {
    await this.updateOrchestrator(userId, environmentId, {
      status: 'terminating',
      message: 'Environment termination requested',
    });

    return { message: 'Environment termination requested', status: 'terminating' };
  }

  async getEnvironmentStatus(
    userId: string,
    environmentId: string
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
    const env = await this.findOne(userId, environmentId);
    const cfg = (env.config as Record<string, unknown>) ?? {};
    const orchestrator = (cfg.orchestrator as Record<string, unknown>) ?? {};

    const status = (orchestrator.status as string | undefined) ?? 'unknown';
    const details = (orchestrator.details as Record<string, unknown> | undefined) ?? {};

    return {
      environmentId,
      status,
      state: status,
      instanceId: this.readString(details.instanceId) ?? undefined,
      privateIp: this.readString(details.privateIp) ?? undefined,
      ipv6Addresses: Array.isArray(details.ipv6Addresses)
        ? details.ipv6Addresses.filter((v): v is string => typeof v === 'string')
        : undefined,
      region: env.region ?? undefined,
      lastUpdated:
        this.readString(orchestrator.ts) ?? this.readString(orchestrator.updatedAt) ?? new Date().toISOString(),
    };
  }

  async createTerminalSession(
    userId: string,
    environmentId: string
  ): Promise<{ token: string; expiresAt: string; wsUrl: string }> {
    const env = await this.findOne(userId, environmentId);
    const ttl = this.sessionTtlSeconds();
    const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
    const nonce = randomBytes(12).toString('hex');

    const token = this.jwtService.sign(
      {
        typ: 'terminal_session',
        sub: userId,
        envId: environmentId,
        nonce,
      },
      {
        secret: this.sessionSecret(),
        expiresIn: ttl,
      }
    );

    const config = (env.config as Record<string, unknown>) ?? {};
    const access = (config.access as Record<string, unknown>) ?? {};
    const sessions = (Array.isArray(access.issuedTerminalNonces)
      ? access.issuedTerminalNonces
      : []) as string[];

    await this.prisma.client.environment.update({
      where: { id: environmentId },
      data: {
        config: {
          ...config,
          access: {
            ...access,
            issuedTerminalNonces: [...sessions.slice(-20), nonce],
            terminalSessionIssuedAt: new Date().toISOString(),
          },
        },
      },
    });

    return {
      token,
      expiresAt,
      wsUrl: this.terminalWsBaseUrl(),
    };
  }

  async createProxySession(
    userId: string,
    environmentId: string,
    serviceKey?: string
  ): Promise<{ token: string; expiresAt: string }> {
    await this.findOne(userId, environmentId);

    const ttl = this.sessionTtlSeconds();
    const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
    const token = this.jwtService.sign(
      {
        typ: 'proxy_session',
        sub: userId,
        envId: environmentId,
        serviceKey: serviceKey ?? '*',
      },
      {
        secret: this.sessionSecret(),
        expiresIn: ttl,
      }
    );

    return { token, expiresAt };
  }

  async listServiceRoutes(
    userId: string,
    environmentId: string
  ): Promise<{ key: string; path: string; description?: string }[]> {
    const env = await this.findOne(userId, environmentId);
    const cfg = (env.config as Record<string, unknown>) ?? {};
    const services = (cfg.services as Record<string, unknown>[] | undefined) ?? [];

    if (!Array.isArray(services) || services.length === 0) {
      return [{ key: 'app', path: '/svc/app/', description: 'Default application service' }];
    }

    const routes: { key: string; path: string; description?: string }[] = [];
    for (const svc of services) {
      const key = this.readString(svc.key);
      if (!key) continue;
      routes.push({
        key,
        path: `/svc/${key}/`,
        description: this.readString(svc.description) ?? undefined,
      });
    }
    return routes;
  }

  async setAccessMode(
    userId: string,
    environmentId: string,
    mode?: 'site_only' | 'api_key_enabled'
  ): Promise<Environment> {
    if (!mode) {
      throw new BadRequestException('mode is required');
    }
    if (mode === 'api_key_enabled' && !this.externalApiKeyModeEnabled()) {
      throw new ForbiddenException('External API-key mode is not enabled for this account plan');
    }

    const env = await this.findOne(userId, environmentId);
    const cfg = (env.config as Record<string, unknown>) ?? {};
    const access = (cfg.access as Record<string, unknown>) ?? {};

    const updated = await this.prisma.client.environment.update({
      where: { id: environmentId },
      data: {
        config: {
          ...cfg,
          access: {
            ...access,
            mode,
            updatedAt: new Date().toISOString(),
          },
        },
      },
    });

    return this.formatEnvironment(updated);
  }

  async rotateProdApiKey(
    userId: string,
    environmentId: string
  ): Promise<{ apiKey: string; rotatedAt: string }> {
    if (!this.externalApiKeyModeEnabled()) {
      throw new ForbiddenException('External API-key mode is not enabled for this account plan');
    }

    const env = await this.findOne(userId, environmentId);
    const cfg = (env.config as Record<string, unknown>) ?? {};
    const access = (cfg.access as Record<string, unknown>) ?? {};

    const apiKey = `pk_live_${randomBytes(24).toString('hex')}`;
    const rotatedAt = new Date().toISOString();

    await this.prisma.client.environment.update({
      where: { id: environmentId },
      data: {
        config: {
          ...cfg,
          access: {
            ...access,
            prodApiKeyHash: this.sha256(apiKey),
            prodApiKeyRotatedAt: rotatedAt,
          },
        },
      },
    });

    return { apiKey, rotatedAt };
  }

  async recordActivity(userId: string, environmentId: string): Promise<string> {
    await this.findOne(userId, environmentId);

    const now = new Date().toISOString();
    const current = await this.prisma.client.environment.findUnique({
      where: { id: environmentId },
      select: { config: true },
    });

    await this.prisma.client.environment.update({
      where: { id: environmentId },
      data: {
        config: {
          ...((current?.config as Record<string, unknown>) ?? {}),
          lastActivityAt: now,
        },
      },
    });

    return now;
  }

  async getLastActivityAt(environmentId: string): Promise<string | null> {
    const env = await this.prisma.client.environment.findUnique({
      where: { id: environmentId },
      select: { config: true, updatedAt: true, createdAt: true },
    });
    if (!env) return null;

    const cfg = (env.config as Record<string, unknown>) ?? {};
    const last = cfg.lastActivityAt;
    if (typeof last === 'string' && last.length > 0) return last;

    return (env.updatedAt || env.createdAt).toISOString();
  }

  private async updateOrchestrator(
    userId: string,
    environmentId: string,
    data: { status: OrchestratorStatus; message: string }
  ): Promise<void> {
    const env = await this.findOne(userId, environmentId);
    const config = (env.config as Record<string, unknown>) ?? {};
    const current = (config.orchestrator as Record<string, unknown>) ?? {};

    await this.prisma.client.environment.update({
      where: { id: environmentId },
      data: {
        config: {
          ...config,
          orchestrator: {
            ...current,
            status: data.status,
            message: data.message,
            ts: new Date().toISOString(),
          },
        },
      },
    });
  }

  private sessionSecret(): string {
    const secret = process.env.ENV_SESSION_SECRET || process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('ENV_SESSION_SECRET (or JWT_SECRET) must be set');
    }
    return secret;
  }

  private sessionTtlSeconds(): number {
    const parsed = Number(process.env.ENV_SESSION_TTL_SECONDS || '120');
    if (!Number.isFinite(parsed) || parsed <= 0) return 120;
    return parsed;
  }

  private terminalWsBaseUrl(): string {
    return process.env.TERMINAL_GATEWAY_WS_URL || 'wss://terminal.pytholit.dev/ws';
  }

  private externalApiKeyModeEnabled(): boolean {
    return process.env.ENABLE_EXTERNAL_PROD_API_KEY_MODE === 'true';
  }

  private sha256(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }

  private readString(input: unknown): string | null {
    return typeof input === 'string' && input.length > 0 ? input : null;
  }

  private formatEnvironment(env: any): Environment {
    return {
      id: env.id,
      ownerId: env.ownerId,
      name: env.name,
      displayName: env.displayName,
      tierPolicy: env.tierPolicy,
      executionMode: env.executionMode,
      region: env.region,
      visibility: env.visibility,
      config: env.config,
      createdAt: env.createdAt.toISOString(),
      updatedAt: env.updatedAt.toISOString(),
    };
  }
}
