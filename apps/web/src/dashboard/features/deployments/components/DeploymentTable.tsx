import type { Deployment } from '@/shared/types';

import { DeploymentRow } from './DeploymentRow';

interface DeploymentTableProps {
  deployments: Deployment[];
  onProjectClick: (projectId: string) => void;
}

export const DeploymentTable = ({ deployments, onProjectClick }: DeploymentTableProps) => (
  <div className="overflow-hidden border border-border-default bg-bg-panel">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="border-b border-border-default bg-black/50">
          <tr>
            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-text-muted">
              PROJECT
            </th>
            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-text-muted">
              STATUS
            </th>
            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-text-muted">
              REGION
            </th>
            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-text-muted">
              DEPLOYED
            </th>
            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-text-muted">
              URL
            </th>
            <th className="w-24 px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-text-muted">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
          {deployments.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center font-mono text-text-muted">
                No deployments match this filter.
              </td>
            </tr>
          ) : (
            deployments.map(d => (
              <DeploymentRow key={d.id} deployment={d} onProjectClick={onProjectClick} />
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);
