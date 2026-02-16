import { Clock, ExternalLink, Globe, MoreVertical,RefreshCw, Square } from 'lucide-react';

import type { Deployment } from '@/shared/types';

import { DeploymentStatusBadge } from './DeploymentStatusBadge';

interface DeploymentRowProps {
  deployment: Deployment;
  onProjectClick: (projectId: string) => void;
}

export const DeploymentRow = ({ deployment: d, onProjectClick }: DeploymentRowProps) => (
  <tr className="border-b border-nexus-gray/30 hover:bg-nexus-gray/5 transition-colors group">
    <td className="px-4 py-4">
      <button
        onClick={() => onProjectClick(d.projectId)}
        className="font-sans font-bold text-white group-hover:text-nexus-purple transition-colors text-left"
      >
        {d.projectName}
      </button>
    </td>
    <td className="px-4 py-4">
      <DeploymentStatusBadge status={d.status} />
    </td>
    <td className="px-4 py-4 font-mono text-xs text-nexus-light">{d.region}</td>
    <td className="px-4 py-4 font-mono text-xs text-nexus-muted flex items-center gap-1.5">
      <Clock size={12} />
      {d.deployedAt}
      {d.buildDuration != null && d.buildDuration > 0 && (
        <span className="text-nexus-gray">({d.buildDuration}s)</span>
      )}
    </td>
    <td className="px-4 py-4">
      {d.url ? (
        <a
          href={d.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-nexus-purple hover:text-nexus-neon transition-colors"
        >
          <Globe size={12} />
          Open
          <ExternalLink size={10} />
        </a>
      ) : (
        <span className="font-mono text-xs text-nexus-gray">—</span>
      )}
    </td>
    <td className="px-4 py-4">
      <div className="flex items-center gap-1">
        {d.status === 'live' && (
          <button
            className="p-1.5 border border-nexus-gray hover:border-nexus-purple text-nexus-muted hover:text-nexus-purple transition-colors"
            title="Redeploy"
          >
            <RefreshCw size={12} />
          </button>
        )}
        {(d.status === 'live' || d.status === 'deploying') && (
          <button
            className="p-1.5 border border-nexus-gray hover:border-red-500 text-nexus-muted hover:text-red-500 transition-colors"
            title="Stop"
          >
            <Square size={12} className="fill-current" />
          </button>
        )}
        <button
          className="p-1.5 border border-nexus-gray hover:border-nexus-purple text-nexus-muted hover:text-nexus-purple transition-colors"
          title="More"
        >
          <MoreVertical size={12} />
        </button>
      </div>
    </td>
  </tr>
);
