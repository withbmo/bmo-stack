import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ORCHESTRATOR_STATUS } from '@pytholit/contracts';

import { PrismaService } from '../../database/prisma.service';
import { EnvironmentsConfigService } from '../environments.config';
import * as EnvironmentsUtils from '../environments.utils';

type OrchestratorEnvStatusResponse = {
  environmentId?: unknown;
  state?: unknown;
  instanceId?: unknown;
  privateIp?: unknown;
  lastUpdated?: unknown;
};

function mapEc2StateToOrchestratorStatus(state: string): string {
  switch (state) {
    case 'pending':
      return ORCHESTRATOR_STATUS.STARTING;
    case 'running':
      return ORCHESTRATOR_STATUS.READY;
    case 'stopping':
      return ORCHESTRATOR_STATUS.STOPPING;
    case 'stopped':
      return ORCHESTRATOR_STATUS.STOPPED;
    default:
      return ORCHESTRATOR_STATUS.UNKNOWN;
  }
}

async function forEachConcurrent<T>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<void>
): Promise<void> {
  const limit = Math.max(1, Math.floor(concurrency));
  const executing = new Set<Promise<void>>();
  for (const item of items) {
    const p = fn(item);
    executing.add(p);
    p.finally(() => executing.delete(p)).catch(() => undefined);
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }
  await Promise.all(executing);
}

@Injectable()
export class EnvironmentsStatusReconcileService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EnvironmentsStatusReconcileService.name);
  private interval: NodeJS.Timeout | null = null;
  private running = false;

  private static readonly INTERVAL_MS = 5 * 60 * 1000;
  private static readonly STALE_AFTER_MS = 10 * 60 * 1000;
  private static readonly BATCH_SIZE = 200;
  private static readonly MAX_CONCURRENCY = 5;

  constructor(
    private readonly prisma: PrismaService,
    private readonly envConfig: EnvironmentsConfigService
  ) {}

  onModuleInit(): void {
    // Best-effort: do not crash boot if orchestration isn't configured.
    this.interval = setInterval(() => {
      void this.reconcileStaleEnvironments().catch((err) => {
        this.logger.warn(`env_status_reconcile_tick_failed: ${(err as Error).message}`);
      });
    }, EnvironmentsStatusReconcileService.INTERVAL_MS);

    setTimeout(() => {
      void this.reconcileStaleEnvironments().catch((err) => {
        this.logger.warn(`env_status_reconcile_initial_failed: ${(err as Error).message}`);
      });
    }, 10_000);
  }

  onModuleDestroy(): void {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
  }

  async reconcileStaleEnvironments(): Promise<void> {
    if (this.running) return;
    if (!this.envConfig.internalSecret) return;
    if (!this.envConfig.orchestratorUrl) return;

    const staleBefore = new Date(Date.now() - EnvironmentsStatusReconcileService.STALE_AFTER_MS);
    this.running = true;
    try {
      const envs = await this.prisma.client.environment.findMany({
        where: {
          orchestratorStatus: {
            in: [
              ORCHESTRATOR_STATUS.STARTING,
              ORCHESTRATOR_STATUS.STOPPING,
              ORCHESTRATOR_STATUS.UNKNOWN,
            ],
          },
          orchestratorStatusUpdatedAt: { lt: staleBefore },
        },
        orderBy: { orchestratorStatusUpdatedAt: 'asc' },
        take: EnvironmentsStatusReconcileService.BATCH_SIZE,
        select: { id: true, ownerId: true, region: true, config: true, orchestratorStatus: true },
      });

      if (envs.length === 0) return;

      await forEachConcurrent(envs, EnvironmentsStatusReconcileService.MAX_CONCURRENCY, async (env) => {
        await this.reconcileOne(env.id, env.region, env.config);
      });
    } finally {
      this.running = false;
    }
  }

  async reconcileStaleEnvironmentsForOwner(ownerId: string): Promise<{ reconciled: number }> {
    if (!this.envConfig.internalSecret) return { reconciled: 0 };

    const staleBefore = new Date(Date.now() - EnvironmentsStatusReconcileService.STALE_AFTER_MS);
    const envs = await this.prisma.client.environment.findMany({
      where: {
        ownerId,
        orchestratorStatus: {
          in: [
            ORCHESTRATOR_STATUS.STARTING,
            ORCHESTRATOR_STATUS.STOPPING,
            ORCHESTRATOR_STATUS.UNKNOWN,
          ],
        },
        orchestratorStatusUpdatedAt: { lt: staleBefore },
      },
      orderBy: { orchestratorStatusUpdatedAt: 'asc' },
      take: 50,
      select: { id: true, region: true, config: true },
    });

    if (envs.length === 0) return { reconciled: 0 };

    let reconciled = 0;
    await forEachConcurrent(envs, 3, async (env) => {
      const ok = await this.reconcileOne(env.id, env.region, env.config);
      if (ok) reconciled += 1;
    });

    return { reconciled };
  }

  private async reconcileOne(environmentId: string, region: string, config: unknown): Promise<boolean> {
    const res = await this.fetchOrchestratorStatus(environmentId, region).catch((err) => {
      this.logger.debug('env_status_reconcile_fetch_failed', {
        environmentId,
        region,
        message: (err as Error).message,
      });
      return null;
    });
    if (!res) return false;

    const state = EnvironmentsUtils.readString(res.state) ?? ORCHESTRATOR_STATUS.UNKNOWN;
    const mappedStatus = mapEc2StateToOrchestratorStatus(state);
    const instanceId = EnvironmentsUtils.readString(res.instanceId);
    const privateIp = EnvironmentsUtils.readString(res.privateIp);

    const now = new Date();
    const cfg = EnvironmentsUtils.getConfig({ config });
    const currentOrch = EnvironmentsUtils.getOrchestratorConfig(cfg);
    const currentDetails = (currentOrch.details as Record<string, unknown> | undefined) ?? {};

    const nextConfig = {
      ...cfg,
      orchestrator: {
        ...currentOrch,
        status: mappedStatus,
        message: currentOrch.message ?? 'Reconciled from orchestrator status poll',
        ts: now.toISOString(),
        details: {
          ...currentDetails,
          ...(instanceId ? { instanceId } : {}),
          ...(privateIp ? { privateIp } : {}),
          ...(region ? { region } : {}),
        },
      },
    };

    await this.prisma.client.environment.update({
      where: { id: environmentId },
      data: {
        orchestratorStatus: mappedStatus,
        orchestratorStatusUpdatedAt: now,
        config: nextConfig,
      },
      select: { id: true },
    });

    return true;
  }

  private async fetchOrchestratorStatus(
    environmentId: string,
    region: string
  ): Promise<OrchestratorEnvStatusResponse> {
    const secret = this.envConfig.internalSecret;
    if (!secret) {
      throw new Error('INTERNAL_SECRET is required for orchestrator status reconciliation');
    }

    const base = this.envConfig.orchestratorUrl.replace(/\/+$/, '');
    const qs = new URLSearchParams({ region });
    const url = `${base}/internal/environments/${encodeURIComponent(environmentId)}/status?${qs.toString()}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.envConfig.orchestratorTimeoutMs);
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'x-internal-secret': secret },
        signal: controller.signal,
      });
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`Orchestrator GET status failed with ${res.status}: ${body}`);
      }
      return (await res.json()) as OrchestratorEnvStatusResponse;
    } finally {
      clearTimeout(timeout);
    }
  }
}

