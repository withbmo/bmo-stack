import type { Deployment } from '@/shared/types';

import { DeploymentRow } from './DeploymentRow';

interface DeploymentTableProps {
  deployments: Deployment[];
  onProjectClick: (projectId: string) => void;
}

export const DeploymentTable = ({ deployments, onProjectClick }: DeploymentTableProps) => (
  <div className="bg-bg-panel border border-nexus-gray overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-black/50 border-b border-nexus-gray">
          <tr>
            <th className="px-4 py-3 text-[10px] font-mono text-nexus-muted uppercase tracking-wider">
              PROJECT
            </th>
            <th className="px-4 py-3 text-[10px] font-mono text-nexus-muted uppercase tracking-wider">
              STATUS
            </th>
            <th className="px-4 py-3 text-[10px] font-mono text-nexus-muted uppercase tracking-wider">
              REGION
            </th>
            <th className="px-4 py-3 text-[10px] font-mono text-nexus-muted uppercase tracking-wider">
              DEPLOYED
            </th>
            <th className="px-4 py-3 text-[10px] font-mono text-nexus-muted uppercase tracking-wider">
              URL
            </th>
            <th className="px-4 py-3 text-[10px] font-mono text-nexus-muted uppercase tracking-wider w-24">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
          {deployments.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center font-mono text-nexus-muted">
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
