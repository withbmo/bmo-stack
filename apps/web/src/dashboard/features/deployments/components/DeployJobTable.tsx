import type { DeployJob, Environment } from '@/shared/types';
import { DeployJobRow } from './DeployJobRow';

interface DeployJobTableProps {
  jobs: DeployJob[];
  environmentLookup: Record<string, Environment>;
}

export const DeployJobTable = ({ jobs, environmentLookup }: DeployJobTableProps) => (
  <div className="bg-bg-panel border border-nexus-gray overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-black/50 border-b border-nexus-gray">
          <tr>
            <th className="px-4 py-3 text-[10px] font-mono text-nexus-muted uppercase tracking-wider">
              Time
            </th>
            <th className="px-4 py-3 text-[10px] font-mono text-nexus-muted uppercase tracking-wider">
              Environment
            </th>
            <th className="px-4 py-3 text-[10px] font-mono text-nexus-muted uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-[10px] font-mono text-nexus-muted uppercase tracking-wider">
              Triggered By
            </th>
            <th className="px-4 py-3 text-[10px] font-mono text-nexus-muted uppercase tracking-wider">
              Mode
            </th>
            <th className="px-4 py-3 text-[10px] font-mono text-nexus-muted uppercase tracking-wider w-28">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {jobs.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center font-mono text-nexus-muted">
                No deploy jobs for this project yet.
              </td>
            </tr>
          ) : (
            jobs.map(job => (
              <DeployJobRow
                key={job.id}
                job={job}
                environment={environmentLookup[job.environmentId] || null}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);
