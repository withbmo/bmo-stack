import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { AccessMode, Environment, ServerPreset } from '@pytholit/contracts';
import { ACCESS_MODE, ENVIRONMENT_REGION, ORCHESTRATOR_STATUS } from '@pytholit/contracts';
import type { Environment as PrismaEnvironment } from '@pytholit/db';
import { randomBytes } from 'crypto';

import { PrismaService } from '../database/prisma.service';
import { EnvironmentsConfigService } from './environments.config';
import {
  JWT_TYP_PROXY_SESSION,
  JWT_TYP_TERMINAL_SESSION,
  TERMINAL_NONCE_LIST_SIZE,
} from './environments.constants';
import * as EnvironmentsUtils from './environments.utils';
import { EnvironmentsCrudService } from './services/environments-crud.service';
import { EnvironmentsLifecycleService } from './services/environments-lifecycle.service';

// Orchestrator and config types moved to lifecycle service

/**
 * Implements environment CRUD, lifecycle (start/stop/terminate via env-orchestrator),
 * session issuance (terminal and proxy JWTs), access mode, and server presets.
 * Uses Prisma for persistence and JwtService for session tokens; lifecycle actions
 * call the env-orchestrator over HTTP; orchestrator callbacks update config.orchestrator
 * and are secured by INTERNAL_SECRET. Ownership is enforced via userId on all
 * user-facing methods; applyOrchestratorCallback and getLastActivityAt do not take userId.
 */
@Injectable()
export class EnvironmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly envConfig: EnvironmentsConfigService,
    private readonly crudService: EnvironmentsCrudService,
    private readonly lifecycleService: EnvironmentsLifecycleService
  ) {}

  // CRUD operations moved to EnvironmentsCrudService

  // Lifecycle methods (start, stop, terminate) moved to EnvironmentsLifecycleService

  async startEnvironment(userId: string, environmentId: string): Promise<{ message: string; status: string }> {
    return this.lifecycleService.startEnvironment(userId, environmentId);
  }

  async stopEnvironment(userId: string, environmentId: string): Promise<{ message: string; status: string }> {
    return this.lifecycleService.stopEnvironment(userId, environmentId);
  }

  async terminateEnvironment(userId: string, environmentId: string): Promise<{ message: string; status: string }> {
    return this.lifecycleService.terminateEnvironment(userId, environmentId);
  }

  listServerPresets(): ServerPreset[] {
    return this.lifecycleService.listServerPresets();
  }

  async listConfiguredRegions(): Promise<{ region: string }[]> {
    return this.lifecycleService.listConfiguredRegions();
  }

  async listInstanceTypes(
    region: string,
    arch: 'x86_64' | 'arm64',
    q?: string,
    limit?: string
  ): Promise<{ instanceType: string; vcpu: number; memoryMiB: number }[]> {
    return this.lifecycleService.listInstanceTypes(region, arch, q, limit);
  }

  async getInstanceType(
    region: string,
    arch: 'x86_64' | 'arm64',
    instanceType: string
  ): Promise<{ instanceType: string; vcpu: number; memoryMiB: number }> {
    return this.lifecycleService.getInstanceType(region, arch, instanceType);
  }

  /**
   * Called by env-orchestrator only. Validates INTERNAL_SECRET; updates config.orchestrator (status, message, ts, details).
   * No userId; 403 if secret invalid, 404 if env missing.
   */
  async applyOrchestratorCallback(
    environmentId: string,
    incomingSecret: string,
    status: string,
    details: Record<string, unknown>
  ): Promise<void> {
    return this.lifecycleService.applyOrchestratorCallback(
      environmentId,
      incomingSecret,
      status,
      details
    );
  }

  /**
   * Read orchestrator status and details (instanceId, privateIp, etc.) from config; ownership via findOne.
   * Returns environmentId, status, state, lastUpdated, and optional instanceId/privateIp/region/ipv6Addresses.
   */
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
    const env = await this.crudService.findOne(userId, environmentId);
    const cfg = this.getConfig(env);
    const orchestrator = this.getOrchestratorConfig(cfg);

    const status = (orchestrator.status as string | undefined) ?? ORCHESTRATOR_STATUS.UNKNOWN;
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
        this.readString(orchestrator.ts) ??
        this.readString(orchestrator.updatedAt) ??
        new Date().toISOString(),
    };
  }

  /**
   * Issue short-lived JWT (typ terminal_session) and return token, expiresAt, wsUrl.
   * Requires environment status READY and a known instanceId. Includes instanceId and
   * region in the JWT so the terminal gateway can call SSM without a DynamoDB lookup.
   */
  async createTerminalSession(
    userId: string,
    environmentId: string
  ): Promise<{ token: string; expiresAt: string; wsUrl: string }> {
    const ttl = this.envConfig.sessionTtlSeconds;
    const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
    const nonce = randomBytes(12).toString('hex');

    const { instanceId, region } = await this.prisma.client.$transaction(async (tx) => {
      const env = await tx.environment.findUnique({
        where: { id: environmentId },
        select: { ownerId: true, region: true, config: true },
      });

      if (!env) throw new NotFoundException('Environment not found');
      if (env.ownerId !== userId) throw new ForbiddenException('Access denied to this environment');

      const cfg = this.getConfig(env);
      const orchestrator = this.getOrchestratorConfig(cfg);
      const orchestratorStatus = this.readString(orchestrator.status);
      if (orchestratorStatus !== ORCHESTRATOR_STATUS.READY) {
        throw new BadRequestException(
          `Environment is not ready for terminal access (status: ${orchestratorStatus ?? ORCHESTRATOR_STATUS.UNKNOWN})`
        );
      }
      const details = (orchestrator.details as Record<string, unknown>) ?? {};
      const instId = this.readString(details.instanceId);
      if (!instId) {
        throw new BadRequestException(
          'Instance ID is not available; the environment may still be starting'
        );
      }

      const access = this.getAccessConfig(cfg);
      const sessions = (
        Array.isArray(access.issuedTerminalNonces) ? access.issuedTerminalNonces : []
      ) as string[];

      await tx.environment.update({
        where: { id: environmentId },
        data: {
          config: {
            ...cfg,
            access: {
              ...access,
              issuedTerminalNonces: [...sessions.slice(-TERMINAL_NONCE_LIST_SIZE), nonce],
              terminalSessionIssuedAt: new Date().toISOString(),
            },
          },
        },
      });

      return {
        instanceId: instId,
        region: this.readString(env.region) ?? ENVIRONMENT_REGION.US_EAST_1,
      };
    });

    const token = this.jwtService.sign(
      {
        typ: JWT_TYP_TERMINAL_SESSION,
        sub: userId,
        envId: environmentId,
        nonce,
        instanceId,
        region,
      },
      {
        secret: this.requireSessionSecret(),
        expiresIn: ttl,
      }
    );

    return {
      token,
      expiresAt,
      wsUrl: this.envConfig.terminalWsBaseUrl,
    };
  }


  /** Issue proxy session JWT (typ proxy_session, serviceKey or '*'). Returns token and expiresAt; no DB config change. */
  async createProxySession(
    userId: string,
    environmentId: string,
    serviceKey?: string
  ): Promise<{ token: string; expiresAt: string }> {
    await this.crudService.findOne(userId, environmentId);

    const ttl = this.envConfig.sessionTtlSeconds;
    const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
    const token = this.jwtService.sign(
      {
        typ: JWT_TYP_PROXY_SESSION,
        sub: userId,
        envId: environmentId,
        serviceKey: serviceKey ?? '*',
      },
      {
        secret: this.requireSessionSecret(),
        expiresIn: ttl,
      }
    );

    return { token, expiresAt };
  }

  /** Return service routes from config.services; if none, default [{ key: 'app', path: '/svc/app/', description }]. Ownership via findOne. */
  async listServiceRoutes(
    userId: string,
    environmentId: string
  ): Promise<{ key: string; path: string; description?: string }[]> {
    const env = await this.crudService.findOne(userId, environmentId);
    const cfg = this.getConfig(env);
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

  /** Set config.access.mode to site_only or api_key_enabled. Throws if mode missing; Forbidden if api_key_enabled and ENABLE_EXTERNAL_PROD_API_KEY_MODE not true. */
  async setAccessMode(
    userId: string,
    environmentId: string,
    mode?: AccessMode
  ): Promise<Environment> {
    if (!mode) {
      throw new BadRequestException('mode is required');
    }
    if (mode === ACCESS_MODE.API_KEY_ENABLED && !this.envConfig.externalApiKeyModeEnabled) {
      throw new ForbiddenException('External API-key mode is not enabled for this account plan');
    }

    const env = await this.crudService.findOne(userId, environmentId);
    const cfg = this.getConfig(env);
    const access = this.getAccessConfig(cfg);

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

  /** Generate new pk_live_* key, store SHA-256 hash in config.access; return plain key and rotatedAt. Forbidden if external API key mode not enabled. */
  async rotateProdApiKey(
    userId: string,
    environmentId: string
  ): Promise<{ apiKey: string; rotatedAt: string }> {
    if (!this.envConfig.externalApiKeyModeEnabled) {
      throw new ForbiddenException('External API-key mode is not enabled for this account plan');
    }

    const env = await this.crudService.findOne(userId, environmentId);
    const cfg = this.getConfig(env);
    const access = this.getAccessConfig(cfg);

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

  /** Set config.lastActivityAt to now; ownership via findOne. Returns the timestamp string. Used for idle/shutdown logic. */
  async recordActivity(userId: string, environmentId: string): Promise<string> {
    await this.crudService.findOne(userId, environmentId);

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

  /** Return config.lastActivityAt or fallback to updatedAt/createdAt. No userId; for internal jobs (e.g. idle shutdown). Returns null if env not found. */
  async getLastActivityAt(environmentId: string): Promise<string | null> {
    const env = await this.prisma.client.environment.findUnique({
      where: { id: environmentId },
      select: { config: true, updatedAt: true, createdAt: true },
    });
    if (!env) return null;

    const cfg = this.getConfig(env);
    const last = cfg.lastActivityAt;
    if (typeof last === 'string' && last.length > 0) return last;

    return (env.updatedAt || env.createdAt).toISOString();
  }

  // Orchestrator utility methods moved to EnvironmentsLifecycleService

  private getConfig(env: { config?: unknown }): Record<string, unknown> {
    return EnvironmentsUtils.getConfig(env);
  }

  private getOrchestratorConfig(config: Record<string, unknown>): Record<string, unknown> {
    return EnvironmentsUtils.getOrchestratorConfig(config);
  }

  private getAccessConfig(config: Record<string, unknown>): Record<string, unknown> {
    return EnvironmentsUtils.getAccessConfig(config);
  }

  private readString(input: unknown): string | null {
    return EnvironmentsUtils.readString(input);
  }

  private formatEnvironment(env: PrismaEnvironment): Environment {
    return EnvironmentsUtils.formatEnvironment(env);
  }

  private sha256(value: string): string {
    return EnvironmentsUtils.sha256(value);
  }

  private requireSessionSecret(): string {
    const secret = this.envConfig.sessionSecret;
    if (!secret) {
      throw new Error('ENV_SESSION_SECRET (or JWT_SECRET) must be set');
    }
    return secret;
  }

}
