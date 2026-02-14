import { Lock, Globe, Rocket, Play, Square, Trash2, Terminal } from 'lucide-react';
import { Card, Button } from '@/dashboard/components';
import type {
  Environment,
  EnvironmentOrchestratorInfo,
  EnvironmentOrchestratorStatus,
  ExecutionMode,
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
  onUpdate,
  onDeploy,
  onOpenTerminal,
  onStart,
  onStop,
  onTerminate,
  isDeploying = false,
  isActing = false,
}: EnvironmentCardProps) => {
  const { id, name, displayName, executionMode, visibility, region } = environment;
  const orchestrator = (environment.config as Record<string, unknown> | undefined)?.orchestrator as
    | EnvironmentOrchestratorInfo
    | undefined;
  const status: EnvironmentOrchestratorStatus = orchestrator?.status ?? 'unknown';
  const statusMessage =
    orchestrator?.message ?? (status === 'queued' ? 'Queued to start' : undefined);
  const lastError = orchestrator?.last_error ?? undefined;
  const isBusy = isActing || ['queued', 'starting', 'stopping', 'terminating'].includes(status);
  const canStart = ['stopped', 'failed', 'unknown', 'terminated'].includes(status);
  const canStop = status === 'ready';
  const canTerminate = ['ready', 'stopped', 'failed', 'unknown'].includes(status);
  const envConfig = (environment.config as Record<string, unknown> | undefined) ?? {};
  const rawServices = envConfig.services;
  const serviceLinks = Array.isArray(rawServices)
    ? (rawServices as Array<Record<string, unknown>>)
        .map((svc) => {
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
    queued: 'Queued',
    starting: 'Starting',
    ready: 'Ready',
    stopping: 'Stopping',
    stopped: 'Stopped',
    terminating: 'Terminating',
    terminated: 'Terminated',
    failed: 'Failed',
    unknown: 'Unknown',
  };

  const statusClasses: Record<EnvironmentOrchestratorStatus, string> = {
    queued: 'text-text-secondary border-border-dim bg-border-dim/10',
    starting: 'text-brand-primary border-brand-primary/30 bg-brand-primary/10',
    ready: 'text-brand-accent border-brand-accent/30 bg-brand-accent/10',
    stopping: 'text-yellow-300 border-yellow-300/30 bg-yellow-300/10',
    stopped: 'text-text-secondary border-border-dim bg-border-dim/10',
    terminating: 'text-orange-300 border-orange-300/30 bg-orange-300/10',
    terminated: 'text-text-secondary border-border-dim bg-border-dim/10',
    failed: 'text-red-400 border-red-400/30 bg-red-400/10',
    unknown: 'text-text-secondary border-border-dim bg-border-dim/10',
  };

  return (
    <Card className="bg-bg-panel border border-border-dim">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">
            Environment
          </div>
          <div className="text-xl font-sans font-bold text-white mt-1">
            {(displayName || name).toUpperCase()}
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
            {statusLabel[status]}
          </div>
          <div
            className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-1 border ${
              visibility === 'public'
                ? 'text-brand-accent border-brand-accent/30 bg-brand-accent/10'
                : 'text-text-secondary border-border-dim bg-border-dim/10'
            }`}
          >
            {visibility === 'public' ? <Globe size={10} /> : <Lock size={10} />}
            {visibility}
          </div>
        </div>
      </div>

      {lastError ? (
        <div className="mt-3 text-xs font-mono text-red-400">{lastError}</div>
      ) : statusMessage ? (
        <div className="mt-3 text-xs font-mono text-text-secondary">{statusMessage}</div>
      ) : null}

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">
            Execution Mode
          </div>
          <select
            value={executionMode}
            onChange={event => onUpdate(id, { executionMode: event.target.value as ExecutionMode })}
            className="w-full bg-black/60 border border-border-dim text-white text-sm font-mono px-3 py-2 focus:outline-none focus:border-brand-primary"
          >
            <option value="managed">Managed</option>
            <option value="byo_aws">BYO AWS</option>
          </select>
        </div>

        <div className="space-y-2">
          <div className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">
            Visibility
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate(id, { visibility: 'public' })}
              className={`flex-1 border px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                visibility === 'public'
                  ? 'border-brand-accent text-brand-accent bg-brand-accent/10'
                  : 'border-border-dim text-text-secondary hover:text-white'
              }`}
            >
              Public
            </button>
            <button
              onClick={() => onUpdate(id, { visibility: 'private' })}
              className={`flex-1 border px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                visibility === 'private'
                  ? 'border-brand-primary text-brand-primary bg-brand-primary/10'
                  : 'border-border-dim text-text-secondary hover:text-white'
              }`}
            >
              Private
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">
          Actions
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onOpenTerminal && (
            <Button variant="secondary" size="sm" onClick={() => onOpenTerminal(id)}>
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
          {serviceLinks.map((svc) => (
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
