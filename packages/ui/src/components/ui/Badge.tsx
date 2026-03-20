import { Activity, RefreshCw, Square, XCircle, Zap } from 'lucide-react';
import type { ReactNode } from 'react';

import type { DeployJobStatus, DeploymentStatus, ProjectStatus } from '../../types';
import { cn } from '../../utils/cn';

// ─── Variants ─────────────────────────────────────────────────────────────

export type BadgeVariant = 'success' | 'warning' | 'error' | 'muted' | 'purple';

const variantClasses: Record<BadgeVariant, string> = {
  success: 'text-brand-accent border-brand-accent/30 bg-brand-accent/10',
  warning: 'text-state-warning border-state-warning/30 bg-state-warning/10',
  error: 'text-state-error border-state-error/30 bg-state-error/10',
  muted: 'text-text-secondary border-border-dim bg-border-dim/10',
  purple: 'text-brand-primary border-brand-primary/50 bg-brand-primary/10',
};

const baseClass =
  'inline-flex items-center gap-1.5 border px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider';

// ─── Base Badge ──────────────────────────────────────────────────────────

export interface BadgeProps {
  variant: BadgeVariant;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const Badge = ({ variant, icon, children, className }: BadgeProps) => (
  <span className={cn(baseClass, variantClasses[variant], className)}>
    {icon}
    {children}
  </span>
);

// ─── Project status (running, stopped, building, error) ────────────────────

const statusVariant: Record<ProjectStatus, BadgeVariant> = {
  running: 'success',
  stopped: 'muted',
  building: 'warning',
  error: 'error',
};

const statusIcon: Record<ProjectStatus, ReactNode> = {
  running: <Zap size={10} className="fill-current" />,
  stopped: <Square size={10} className="fill-current" />,
  building: <RefreshCw size={10} className="animate-spin" />,
  error: <Activity size={10} />,
};

export interface StatusBadgeProps {
  status: ProjectStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <Badge variant={statusVariant[status] ?? 'muted'} icon={statusIcon[status] ?? null}>
    {status}
  </Badge>
);

// ─── Deployment status (live, stopped, deploying, failed) ──────────────────

const deployVariant: Record<DeploymentStatus, BadgeVariant> = {
  live: 'success',
  stopped: 'muted',
  deploying: 'warning',
  failed: 'error',
};

const deployIcon: Record<DeploymentStatus, ReactNode> = {
  live: <Zap size={10} className="fill-current" />,
  stopped: <Square size={10} className="fill-current" />,
  deploying: <RefreshCw size={10} className="animate-spin" />,
  failed: <XCircle size={10} />,
};

export interface DeploymentStatusBadgeProps {
  status: DeploymentStatus;
}

export const DeploymentStatusBadge = ({ status }: DeploymentStatusBadgeProps) => (
  <Badge variant={deployVariant[status] ?? 'muted'} icon={deployIcon[status] ?? null}>
    {status}
  </Badge>
);

// ─── Deploy job status (queued, running, succeeded, failed, canceled) ──────

const jobVariant: Record<DeployJobStatus, BadgeVariant> = {
  queued: 'muted',
  running: 'warning',
  succeeded: 'success',
  failed: 'error',
  canceled: 'muted',
};

const jobIcon: Record<DeployJobStatus, ReactNode> = {
  queued: <Square size={10} className="fill-current" />,
  running: <RefreshCw size={10} className="animate-spin" />,
  succeeded: <Zap size={10} className="fill-current" />,
  failed: <XCircle size={10} />,
  canceled: <Square size={10} className="fill-current" />,
};

export interface DeployJobStatusBadgeProps {
  status: DeployJobStatus;
}

export const DeployJobStatusBadge = ({ status }: DeployJobStatusBadgeProps) => (
  <Badge variant={jobVariant[status] ?? 'muted'} icon={jobIcon[status] ?? null}>
    {status}
  </Badge>
);

Badge.displayName = 'Badge';
StatusBadge.displayName = 'StatusBadge';
DeploymentStatusBadge.displayName = 'DeploymentStatusBadge';
DeployJobStatusBadge.displayName = 'DeployJobStatusBadge';
