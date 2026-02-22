import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { SSMClient, SendCommandCommand } from '@aws-sdk/client-ssm';

import { PrismaService } from '../database/prisma.service';
import { EnvironmentsConfigService } from './environments.config';

function readString(v: unknown): string | null {
  return typeof v === 'string' && v.length > 0 ? v : null;
}

@Injectable()
export class TerminalTmuxCleanupService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TerminalTmuxCleanupService.name);
  private interval: NodeJS.Timeout | null = null;
  private running = false;
  private readonly ssmClients = new Map<string, SSMClient>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly envConfig: EnvironmentsConfigService
  ) {}

  onModuleInit(): void {
    if (!this.envConfig.tmuxCleanupEnabled) return;

    const intervalMs = this.envConfig.tmuxCleanupIntervalSeconds * 1000;
    this.logger.log(`tmux cleanup enabled (interval ${this.envConfig.tmuxCleanupIntervalSeconds}s)`);

    this.interval = setInterval(() => {
      void this.runOnce().catch((err) => {
        this.logger.error('tmux cleanup tick failed', err as Error);
      });
    }, intervalMs);

    // Run once shortly after boot so stale tabs are cleaned without waiting a full interval.
    setTimeout(() => {
      void this.runOnce().catch((err) => {
        this.logger.error('tmux cleanup initial run failed', err as Error);
      });
    }, 10_000);
  }

  onModuleDestroy(): void {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
    this.ssmClients.clear();
  }

  private getSsm(region: string): SSMClient {
    const cached = this.ssmClients.get(region);
    if (cached) return cached;
    const client = new SSMClient({ region });
    this.ssmClients.set(region, client);
    return client;
  }

  private async runOnce(): Promise<void> {
    if (this.running) return;
    this.running = true;
    try {
      const now = new Date();
      const expiredTabs = await this.prisma.client.terminalTab.findMany({
        where: {
          tmuxEnabled: true,
          archivedAt: null,
          tmuxSessionName: { not: null },
          tmuxExpiresAt: { lt: now },
        },
        orderBy: { tmuxExpiresAt: 'asc' },
        take: this.envConfig.tmuxCleanupMaxTabsPerCycle,
        select: { id: true, environmentId: true, tmuxSessionName: true },
      });

      if (expiredTabs.length === 0) return;

      const byEnv = new Map<string, Array<{ id: string; tmuxSessionName: string }>>();
      for (const t of expiredTabs) {
        const name = readString(t.tmuxSessionName);
        if (!name) continue;
        const list = byEnv.get(t.environmentId) ?? [];
        list.push({ id: t.id, tmuxSessionName: name });
        byEnv.set(t.environmentId, list);
      }

      const envIds = Array.from(byEnv.keys());
      const envs = await this.prisma.client.environment.findMany({
        where: { id: { in: envIds } },
        select: { id: true, region: true, config: true },
      });
      const envById = new Map(envs.map((e) => [e.id, e]));

      for (const envId of envIds) {
        const env = envById.get(envId);
        const tabs = byEnv.get(envId) ?? [];
        if (!env || tabs.length === 0) continue;

        const cfg = (env.config as Record<string, unknown>) ?? {};
        const orch = (cfg.orchestrator as Record<string, unknown>) ?? {};
        const details = (orch.details as Record<string, unknown>) ?? {};
        const instanceId = readString(details.instanceId);
        const region = readString(env.region) ?? readString(details.region);

        if (!instanceId || !region) continue;

        const killLines = tabs.map((t) => {
          const safeName = t.tmuxSessionName.replace(/'/g, '');
          return `tmux kill-session -t '${safeName}' 2>/dev/null || true`;
        });
        const script = [
          'set -e',
          'command -v tmux >/dev/null 2>&1 || exit 0',
          ...killLines,
        ].join('\n');

        try {
          await this.getSsm(region).send(
            new SendCommandCommand({
              InstanceIds: [instanceId],
              DocumentName: 'AWS-RunShellScript',
              Parameters: { commands: [script] },
            })
          );

          await this.prisma.client.terminalTab.updateMany({
            where: { id: { in: tabs.map((t) => t.id) } },
            data: { tmuxExpiresAt: null },
          });
        } catch (err) {
          this.logger.warn(
            `Failed to cleanup tmux sessions for env ${envId}: ${(err as Error).message}`
          );
        }
      }
    } finally {
      this.running = false;
    }
  }
}

