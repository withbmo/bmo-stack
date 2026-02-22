import { ENVIRONMENT_VISIBILITY, ORCHESTRATOR_STATUS } from '@pytholit/contracts';
import { Globe, Lock, Play, Rocket, Settings, Square, Terminal, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { Button, Card } from '@/dashboard/components';
import type {
  Environment,
  EnvironmentOrchestratorInfo,
  EnvironmentOrchestratorStatus,
} from '@/shared/types';

interface EnvironmentCardProps {
  environment: Environment;
  onUpdate: (envId: string, updates: Partial<Environment>) => void;
  onDeploy?: (envId: string) => void;
  onOpenTerminal?: (envId: string) => void;
  onStart?: (envId: string) => void;
  onStop?: (envId: string) => void;
  onTerminate?: (envId: string) => void;
  isDeploying?: boolean;
  isActing?: boolean;
}

export const EnvironmentCard = ({
  environment,
  onUpdate: _onUpdate,
  onDeploy,
  onOpenTerminal,
  onStart,
  onStop,
  onTerminate,
  isDeploying = false,
  isActing = false,
}: EnvironmentCardProps) => {
  void _onUpdate;
  const { id, envType, displayName, visibility, region } = environment;
  const orchestrator = (environment.config as Record<string, unknown> | undefined)?.orchestrator as
    | EnvironmentOrchestratorInfo
    | undefined;
  const status: EnvironmentOrchestratorStatus = orchestrator?.status ?? ORCHESTRATOR_STATUS.UNKNOWN;
  const statusMessage =
    orchestrator?.message ?? (status === ORCHESTRATOR_STATUS.QUEUED ? 'Queued to start' : undefined);
  const lastError = orchestrator?.last_error ?? undefined;
  const isBusy =
    isActing ||
    status === ORCHESTRATOR_STATUS.QUEUED ||
    status === ORCHESTRATOR_STATUS.STARTING ||
    status === ORCHESTRATOR_STATUS.STOPPING ||
    status === ORCHESTRATOR_STATUS.TERMINATING;
  const canStart =
    status === ORCHESTRATOR_STATUS.STOPPED ||
    status === ORCHESTRATOR_STATUS.FAILED ||
    status === ORCHESTRATOR_STATUS.UNKNOWN ||
    status === ORCHESTRATOR_STATUS.TERMINATED;
  const canStop = status === ORCHESTRATOR_STATUS.READY;
  const canTerminate =
    status === ORCHESTRATOR_STATUS.READY ||
    status === ORCHESTRATOR_STATUS.STOPPED ||
    status === ORCHESTRATOR_STATUS.FAILED ||
    status === ORCHESTRATOR_STATUS.UNKNOWN;
  const canOpenTerminal = status === ORCHESTRATOR_STATUS.READY && !isBusy;
  const envConfig = (environment.config as Record<string, unknown> | undefined) ?? {};
  const rawServices = envConfig.services;
  const serviceLinks = Array.isArray(rawServices)
    ? (rawServices as Array<Record<string, unknown>>)
        .map(svc => {
          const key = typeof svc?.key === 'string' ? svc.key : null;
          if (!key) return null;
          return {
            key,
            path: `/svc/${key}/`,
          };
        })
        .filter((v): v is { key: string; path: string } => Boolean(v))
    : [{ key: 'app', path: '/svc/app/' }];

  const statusLabel: Record<EnvironmentOrchestratorStatus, string> = {
    [ORCHESTRATOR_STATUS.QUEUED]: 'Queued',
    [ORCHESTRATOR_STATUS.STARTING]: 'Starting',
    [ORCHESTRATOR_STATUS.READY]: 'Ready',
    [ORCHESTRATOR_STATUS.STOPPING]: 'Stopping',
    [ORCHESTRATOR_STATUS.STOPPED]: 'Stopped',
    [ORCHESTRATOR_STATUS.TERMINATING]: 'Terminating',
    [ORCHESTRATOR_STATUS.TERMINATED]: 'Terminated',
    [ORCHESTRATOR_STATUS.FAILED]: 'Failed',
    [ORCHESTRATOR_STATUS.UNKNOWN]: 'Not provisioned yet',
  };

  const statusClasses: Record<EnvironmentOrchestratorStatus, string> = {
    [ORCHESTRATOR_STATUS.QUEUED]: 'text-slate-200 border-slate-400/30 bg-slate-400/10',
    [ORCHESTRATOR_STATUS.STARTING]: 'text-sky-200 border-sky-400/30 bg-sky-400/10',
    [ORCHESTRATOR_STATUS.READY]: 'text-emerald-200 border-emerald-400/30 bg-emerald-400/10',
    [ORCHESTRATOR_STATUS.STOPPING]: 'text-amber-200 border-amber-400/30 bg-amber-400/10',
    [ORCHESTRATOR_STATUS.STOPPED]: 'text-zinc-200 border-zinc-400/30 bg-zinc-400/10',
    [ORCHESTRATOR_STATUS.TERMINATING]: 'text-orange-200 border-orange-400/30 bg-orange-400/10',
    [ORCHESTRATOR_STATUS.TERMINATED]: 'text-violet-200 border-violet-400/30 bg-violet-400/10',
    [ORCHESTRATOR_STATUS.FAILED]: 'text-rose-200 border-rose-400/30 bg-rose-400/10',
    [ORCHESTRATOR_STATUS.UNKNOWN]: 'text-stone-200 border-stone-400/30 bg-stone-400/10',
  };

  const statusDotClasses: Record<EnvironmentOrchestratorStatus, string> = {
    [ORCHESTRATOR_STATUS.QUEUED]: 'bg-slate-300',
    [ORCHESTRATOR_STATUS.STARTING]: 'bg-sky-300',
    [ORCHESTRATOR_STATUS.READY]: 'bg-emerald-300',
    [ORCHESTRATOR_STATUS.STOPPING]: 'bg-amber-300',
    [ORCHESTRATOR_STATUS.STOPPED]: 'bg-zinc-300',
    [ORCHESTRATOR_STATUS.TERMINATING]: 'bg-orange-300',
    [ORCHESTRATOR_STATUS.TERMINATED]: 'bg-violet-300',
    [ORCHESTRATOR_STATUS.FAILED]: 'bg-rose-300',
    [ORCHESTRATOR_STATUS.UNKNOWN]: 'bg-stone-300',
  };

  return (
    <Card className="bg-bg-panel border border-border-dim">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">
            Environment
          </div>
          <div className="text-xl font-sans font-bold text-white mt-1">
            {(displayName || envType).toUpperCase()}
          </div>
          <div className="text-xs font-mono text-text-secondary mt-2">
            Region: {region ?? 'Unassigned'}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-1 border ${statusClasses[status]}`}
            title={statusMessage}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusDotClasses[status]}`} />
            {statusLabel[status]}
          </div>
          <div
            className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-1 border ${
              visibility === ENVIRONMENT_VISIBILITY.PUBLIC
                ? 'text-brand-accent border-brand-accent/30 bg-brand-accent/10'
                : 'text-text-secondary border-border-dim bg-border-dim/10'
            }`}
          >
            {visibility === ENVIRONMENT_VISIBILITY.PUBLIC ? <Globe size={10} /> : <Lock size={10} />}
            {visibility}
          </div>
          <Link
            href={`/dashboard/environments/${id}/settings`}
            className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-1 border border-border-dim text-text-secondary hover:text-white hover:border-white/30 transition-colors"
          >
            <Settings size={10} />
            <span className="hidden sm:inline">Settings</span>
          </Link>
        </div>
      </div>

      {lastError ? (
        <div className="mt-3 text-xs font-mono text-red-400">{lastError}</div>
      ) : statusMessage ? (
        <div className="mt-3 text-xs font-mono text-text-secondary">{statusMessage}</div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">
          Actions
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onOpenTerminal && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onOpenTerminal(id)}
              disabled={!canOpenTerminal}
              title={!canOpenTerminal ? `Terminal is only available when environment is Ready` : undefined}
            >
              <Terminal size={14} /> Terminal
            </Button>
          )}
          {onDeploy && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onDeploy(id)}
              isLoading={isDeploying}
            >
              <Rocket size={14} /> Deploy
            </Button>
          )}
          {onStart && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onStart(id)}
              isLoading={isActing}
              disabled={isBusy || !canStart}
            >
              <Play size={14} /> Start
            </Button>
          )}
          {onStop && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onStop(id)}
              isLoading={isActing}
              disabled={isBusy || !canStop}
            >
              <Square size={14} /> Stop
            </Button>
          )}
          {onTerminate && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onTerminate(id)}
              isLoading={isActing}
              disabled={isBusy || !canTerminate}
            >
              <Trash2 size={14} /> Terminate
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 border-t border-border-dim pt-4">
        <div className="text-[10px] font-mono text-text-secondary uppercase tracking-wider mb-2">
          Service Paths
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {serviceLinks.map(svc => (
            <span
              key={svc.key}
              className="inline-flex border border-border-dim px-2 py-1 text-[10px] font-mono text-text-secondary"
            >
              {svc.path}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};

EnvironmentCard.displayName = 'EnvironmentCard';
