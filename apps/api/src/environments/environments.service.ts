import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { AccessMode, Environment, ServerPreset } from '@pytholit/contracts';
import { ACCESS_MODE, ENVIRONMENT_REGION, ORCHESTRATOR_STATUS } from '@pytholit/contracts';
import type { Environment as PrismaEnvironment, Prisma } from '@pytholit/db';
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

interface TerminalTabSummary {
  id: string;
  title: string;
  isActive: boolean;
  tmuxEnabled: boolean;
  updatedAt: string;
  lastActiveAt?: string | null;
  archivedAt?: string | null;
}

interface TerminalTabDetail extends TerminalTabSummary {
  transcript: string;
  lastSeq: number;
  tmuxSessionName?: string | null;
  tmuxExpiresAt?: string | null;
}

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
    const expectedSecret = this.envConfig.internalSecret;
    if (!expectedSecret || !this.constantTimeCompare(incomingSecret, expectedSecret)) {
      throw new ForbiddenException('Invalid internal secret');
    }

    const env = await this.prisma.client.environment.findUnique({
      where: { id: environmentId },
    });
    if (!env) throw new NotFoundException('Environment not found');

    const config = this.getConfig(env);
    const current = this.getOrchestratorConfig(config);

    await this.prisma.client.environment.update({
      where: { id: environmentId },
      data: {
        config: {
          ...config,
          orchestrator: {
            ...current,
            status,
            message: this.readString(details.message) ?? `Status updated to ${status}`,
            ts: new Date().toISOString(),
            details: { ...((current.details as Record<string, unknown>) ?? {}), ...details },
          },
        } as unknown as Prisma.InputJsonValue,
      },
    });
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
   * Appends nonce to config.access.issuedTerminalNonces (keeps last 20).
   */
  async createTerminalSession(
    userId: string,
    environmentId: string,
    tabId: string
  ): Promise<{ token: string; expiresAt: string; wsUrl: string }> {
    const ttl = this.envConfig.sessionTtlSeconds;
    const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
    const nonce = randomBytes(12).toString('hex');

    const { instanceId, region, tmuxEnabled, tmuxSessionName } =
      await this.prisma.client.$transaction(async (tx) => {
        const env = await tx.environment.findUnique({
          where: { id: environmentId },
          select: { ownerId: true, region: true, config: true },
        });

        if (!env) throw new NotFoundException('Environment not found');
        if (env.ownerId !== userId) throw new ForbiddenException('Access denied to this environment');

        const tab = await tx.terminalTab.findFirst({
          where: { id: tabId, ownerId: userId, environmentId, archivedAt: null },
          select: { id: true, tmuxEnabled: true, tmuxSessionName: true },
        });
        if (!tab) throw new NotFoundException('Terminal tab not found');

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

        const now = new Date();
        let effectiveTmuxSessionName: string | null = this.readString(tab.tmuxSessionName);
        if (tab.tmuxEnabled && !effectiveTmuxSessionName) {
          effectiveTmuxSessionName = this.generateTmuxSessionName(environmentId, tabId);
          await tx.terminalTab.update({
            where: { id: tab.id },
            data: { tmuxSessionName: effectiveTmuxSessionName },
          });
        }

        if (tab.tmuxEnabled) {
          await tx.terminalTab.update({
            where: { id: tab.id },
            data: {
              tmuxLastUsedAt: now,
              tmuxExpiresAt: new Date(now.getTime() + this.envConfig.tmuxTtlMinutes * 60_000),
              lastActiveAt: now,
            },
          });
        } else {
          await tx.terminalTab.update({
            where: { id: tab.id },
            data: { lastActiveAt: now },
          });
        }

        return {
          instanceId: instId,
          region: this.readString(env.region) ?? ENVIRONMENT_REGION.US_EAST_1,
          tmuxEnabled: tab.tmuxEnabled,
          tmuxSessionName: effectiveTmuxSessionName,
        };
      });

    const token = this.jwtService.sign(
      {
        typ: JWT_TYP_TERMINAL_SESSION,
        sub: userId,
        envId: environmentId,
        nonce,
        tabId,
        instanceId,
        region,
        ...(tmuxEnabled ? { tmuxEnabled: true, tmuxSessionName } : {}),
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

  async listTerminalTabs(userId: string, environmentId: string): Promise<TerminalTabSummary[]> {
    await this.crudService.findOne(userId, environmentId);
    const tabs = await this.prisma.client.terminalTab.findMany({
      where: { ownerId: userId, environmentId, archivedAt: null },
      orderBy: [{ isActive: 'desc' }, { updatedAt: 'desc' }],
    });
    return tabs.map((t) => ({
      id: t.id,
      title: t.title,
      isActive: t.isActive,
      tmuxEnabled: t.tmuxEnabled,
      updatedAt: t.updatedAt.toISOString(),
      lastActiveAt: t.lastActiveAt?.toISOString() ?? null,
      archivedAt: t.archivedAt?.toISOString() ?? null,
    }));
  }

  async createTerminalTab(userId: string, environmentId: string): Promise<TerminalTabSummary> {
    await this.crudService.findOne(userId, environmentId);

    return this.prisma.client.$transaction(async (tx) => {
      const count = await tx.terminalTab.count({
        where: { ownerId: userId, environmentId, archivedAt: null },
      });

      await tx.terminalTab.updateMany({
        where: { ownerId: userId, environmentId, archivedAt: null },
        data: { isActive: false },
      });

      const now = new Date();
      const created = await tx.terminalTab.create({
        data: {
          ownerId: userId,
          environmentId,
          title: `Terminal ${count + 1}`,
          isActive: true,
          lastActiveAt: now,
        },
      });

      return {
        id: created.id,
        title: created.title,
        isActive: created.isActive,
        tmuxEnabled: created.tmuxEnabled,
        updatedAt: created.updatedAt.toISOString(),
        lastActiveAt: created.lastActiveAt?.toISOString() ?? null,
        archivedAt: created.archivedAt?.toISOString() ?? null,
      };
    });
  }

  async getTerminalTab(
    userId: string,
    environmentId: string,
    tabId: string
  ): Promise<TerminalTabDetail> {
    await this.crudService.findOne(userId, environmentId);
    const tab = await this.prisma.client.terminalTab.findFirst({
      where: { id: tabId, ownerId: userId, environmentId, archivedAt: null },
    });
    if (!tab) throw new NotFoundException('Terminal tab not found');
    return {
      id: tab.id,
      title: tab.title,
      isActive: tab.isActive,
      tmuxEnabled: tab.tmuxEnabled,
      updatedAt: tab.updatedAt.toISOString(),
      lastActiveAt: tab.lastActiveAt?.toISOString() ?? null,
      archivedAt: tab.archivedAt?.toISOString() ?? null,
      transcript: tab.transcript,
      lastSeq: Number(tab.lastSeq),
      tmuxSessionName: tab.tmuxSessionName ?? null,
      tmuxExpiresAt: tab.tmuxExpiresAt?.toISOString() ?? null,
    };
  }

  async updateTerminalTab(
    userId: string,
    environmentId: string,
    tabId: string,
    updates: { title?: string; tmuxEnabled?: boolean; isActive?: boolean }
  ): Promise<TerminalTabSummary> {
    await this.crudService.findOne(userId, environmentId);
    const now = new Date();

    return this.prisma.client.$transaction(async (tx) => {
      const tab = await tx.terminalTab.findFirst({
        where: { id: tabId, ownerId: userId, environmentId, archivedAt: null },
      });
      if (!tab) throw new NotFoundException('Terminal tab not found');

      if (updates.isActive) {
        await tx.terminalTab.updateMany({
          where: { ownerId: userId, environmentId, archivedAt: null },
          data: { isActive: false },
        });
      }

      let tmuxSessionName = tab.tmuxSessionName;
      if (typeof updates.tmuxEnabled === 'boolean' && updates.tmuxEnabled && !tmuxSessionName) {
        tmuxSessionName = this.generateTmuxSessionName(environmentId, tabId);
      }

      const updated = await tx.terminalTab.update({
        where: { id: tab.id },
        data: {
          ...(updates.title ? { title: updates.title } : {}),
          ...(typeof updates.tmuxEnabled === 'boolean' ? { tmuxEnabled: updates.tmuxEnabled } : {}),
          ...(updates.isActive ? { isActive: true, lastActiveAt: now } : {}),
          ...(tmuxSessionName !== tab.tmuxSessionName ? { tmuxSessionName } : {}),
          ...(typeof updates.tmuxEnabled === 'boolean' && updates.tmuxEnabled
            ? { tmuxExpiresAt: new Date(now.getTime() + this.envConfig.tmuxTtlMinutes * 60_000) }
            : {}),
        },
      });

      return {
        id: updated.id,
        title: updated.title,
        isActive: updated.isActive,
        tmuxEnabled: updated.tmuxEnabled,
        updatedAt: updated.updatedAt.toISOString(),
        lastActiveAt: updated.lastActiveAt?.toISOString() ?? null,
        archivedAt: updated.archivedAt?.toISOString() ?? null,
      };
    });
  }

  async deleteTerminalTab(
    userId: string,
    environmentId: string,
    tabId: string
  ): Promise<{ ok: true }> {
    await this.crudService.findOne(userId, environmentId);
    const tab = await this.prisma.client.terminalTab.findFirst({
      where: { id: tabId, ownerId: userId, environmentId, archivedAt: null },
      select: { id: true },
    });
    if (!tab) throw new NotFoundException('Terminal tab not found');
    await this.prisma.client.terminalTab.update({
      where: { id: tab.id },
      data: { archivedAt: new Date(), isActive: false },
    });
    return { ok: true };
  }

  async appendTerminalTranscript(
    userId: string,
    environmentId: string,
    tabId: string,
    delta: string,
    seq: number
  ): Promise<{ ok: true; applied: boolean }> {
    await this.crudService.findOne(userId, environmentId);

    // Postgres text cannot store NUL bytes; SSM output can occasionally contain them.
    const sanitizedDelta = delta.replace(/\u0000/g, '');

    if (sanitizedDelta.length > this.envConfig.terminalTranscriptMaxDeltaChars) {
      throw new BadRequestException(
        `delta too large (max ${this.envConfig.terminalTranscriptMaxDeltaChars} chars)`
      );
    }
    if (!Number.isSafeInteger(seq) || seq <= 0) throw new BadRequestException('Invalid seq');

    const maxChars = this.envConfig.terminalTranscriptMaxChars;
    const seqBigInt = BigInt(seq);

    const updatedCount = await this.prisma.client.$executeRaw`
      UPDATE terminal_tabs
      SET transcript = RIGHT(COALESCE(transcript, '') || ${sanitizedDelta}, ${maxChars}),
          last_seq = ${seqBigInt},
          updated_at = NOW()
      WHERE id = ${tabId}
        AND owner_id = ${userId}
        AND environment_id = ${environmentId}
        AND archived_at IS NULL
        AND last_seq < ${seqBigInt};
    `;

    return { ok: true, applied: Number(updatedCount) > 0 };
  }

  private generateTmuxSessionName(environmentId: string, tabId: string): string {
    const env = environmentId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
    const tab = tabId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
    return `pytholit_${env}_${tab}`;
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
    await this.prisma.client.$transaction(async (tx) => {
      const current = await tx.environment.findUnique({
        where: { id: environmentId },
        select: { config: true },
      });

      await tx.environment.update({
        where: { id: environmentId },
        data: {
          config: {
            ...((current?.config as Record<string, unknown>) ?? {}),
            lastActivityAt: now,
          },
        },
      });
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

  private constantTimeCompare(a: string, b: string): boolean {
    return EnvironmentsUtils.constantTimeCompare(a, b);
  }

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
