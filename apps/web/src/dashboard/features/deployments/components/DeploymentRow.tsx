import { Clock, ExternalLink, Globe, MoreVertical, RefreshCw, Square } from 'lucide-react';

import type { Deployment } from '@/shared/types';

import { DeploymentStatusBadge } from './status-badges';

interface DeploymentRowProps {
  deployment: Deployment;
  onProjectClick: (projectId: string) => void;
}

export const DeploymentRow = ({ deployment: d, onProjectClick }: DeploymentRowProps) => (
  <tr className="group border-b border-border-default/30 transition-colors hover:bg-border-default/5">
    <td className="px-4 py-4">
      <button
        onClick={() => onProjectClick(d.projectId)}
        className="text-left font-sans font-bold text-text-primary transition-colors group-hover:text-brand-primary"
      >
        {d.projectName}
      </button>
    </td>
    <td className="px-4 py-4">
      <DeploymentStatusBadge status={d.status} />
    </td>
    <td className="px-4 py-4 font-mono text-xs text-text-secondary">{d.region}</td>
    <td className="flex items-center gap-1.5 px-4 py-4 font-mono text-xs text-text-muted">
      <Clock size={12} />
      {d.deployedAt}
      {d.buildDuration != null && d.buildDuration > 0 && (
        <span className="text-border-default">({d.buildDuration}s)</span>
      )}
    </td>
    <td className="px-4 py-4">
      {d.url ? (
        <a
          href={d.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-brand-primary transition-colors hover:text-brand-neon"
        >
          <Globe size={12} />
          Open
          <ExternalLink size={10} />
        </a>
      ) : (
        <span className="font-mono text-xs text-border-default">—</span>
      )}
    </td>
    <td className="px-4 py-4">
      <div className="flex items-center gap-1">
        {d.status === 'live' && (
          <button
            className="border border-border-default p-1.5 text-text-muted transition-colors hover:border-brand-primary hover:text-brand-primary"
            title="Redeploy"
          >
            <RefreshCw size={12} />
          </button>
        )}
        {(d.status === 'live' || d.status === 'deploying') && (
          <button
            className="border border-border-default p-1.5 text-text-muted transition-colors hover:border-red-500 hover:text-red-500"
            title="Stop"
          >
            <Square size={12} className="fill-current" />
          </button>
        )}
        <button
          className="border border-border-default p-1.5 text-text-muted transition-colors hover:border-brand-primary hover:text-brand-primary"
          title="More"
        >
          <MoreVertical size={12} />
        </button>
      </div>
    </td>
  </tr>
);
