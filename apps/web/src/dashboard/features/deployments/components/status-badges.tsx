'use client';

import { RefreshCw, Square, XCircle, Zap } from 'lucide-react';
import type { ReactNode } from 'react';

import type { DeployJobStatus, DeploymentStatus } from '@/shared/types';
import { Badge } from '@/ui/shadcn/ui/badge';
import { cn } from '@/lib/utils';

export const DeploymentStatusBadge = ({ status }: { status: DeploymentStatus }) => {
  const config = deploymentStatusConfig[status];
  return (
    <Badge variant="outline" className={cn('inline-flex items-center gap-1.5', config.className)}>
      {config.icon}
      {status}
    </Badge>
  );
};

export const DeployJobStatusBadge = ({ status }: { status: DeployJobStatus }) => {
  const config = deployJobStatusConfig[status];
  return (
    <Badge variant="outline" className={cn('inline-flex items-center gap-1.5', config.className)}>
      {config.icon}
      {status}
    </Badge>
  );
};

const deploymentStatusConfig: Record<
  DeploymentStatus,
  { icon: ReactNode; className: string }
> = {
  live: { icon: <Zap size={12} />, className: 'border-emerald-500/40 text-emerald-500' },
  stopped: { icon: <Square size={12} className="fill-current" />, className: 'text-muted-foreground' },
  deploying: {
    icon: <RefreshCw size={12} className="animate-spin" />,
    className: 'border-amber-500/40 text-amber-500',
  },
  failed: { icon: <XCircle size={12} />, className: 'border-destructive/40 text-destructive' },
};

const deployJobStatusConfig: Record<
  DeployJobStatus,
  { icon: ReactNode; className: string }
> = {
  queued: { icon: <Square size={12} className="fill-current" />, className: 'text-muted-foreground' },
  running: {
    icon: <RefreshCw size={12} className="animate-spin" />,
    className: 'border-amber-500/40 text-amber-500',
  },
  succeeded: { icon: <Zap size={12} />, className: 'border-emerald-500/40 text-emerald-500' },
  failed: { icon: <XCircle size={12} />, className: 'border-destructive/40 text-destructive' },
  canceled: { icon: <Square size={12} className="fill-current" />, className: 'text-muted-foreground' },
};
