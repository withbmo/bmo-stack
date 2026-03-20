import type { DeployJob } from '@/shared/types';

import { DeployJobRow } from './DeployJobRow';

interface DeployJobTableProps {
  jobs: DeployJob[];
}

export const DeployJobTable = ({ jobs }: DeployJobTableProps) => (
  <div className="overflow-hidden border border-border-default bg-bg-panel">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="border-b border-border-default bg-black/50">
          <tr>
            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-text-muted">
              Time
            </th>
            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-text-muted">
              Status
            </th>
            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-text-muted">
              Triggered By
            </th>
            <th className="w-28 px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-text-muted">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {jobs.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-12 text-center font-mono text-text-muted">
                No deploy jobs for this project yet.
              </td>
            </tr>
          ) : (
            jobs.map(job => <DeployJobRow key={job.id} job={job} />)
          )}
        </tbody>
      </table>
    </div>
  </div>
);
