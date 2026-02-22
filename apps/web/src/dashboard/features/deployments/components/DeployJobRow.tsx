import { Button,DeployJobStatusBadge } from '@/dashboard/components';
import { formatTimestamp } from '@/shared/lib/date';
import type { DeployJob, Environment } from '@/shared/types';

interface DeployJobRowProps {
  job: DeployJob;
  environment: Environment | null;
}

export const DeployJobRow = ({ job, environment }: DeployJobRowProps) => {
  return (
    <tr className="border-b border-nexus-gray/40 hover:bg-white/2 transition-colors">
      <td className="px-4 py-3 text-xs font-mono text-white">{formatTimestamp(job.createdAt)}</td>
      <td className="px-4 py-3 text-xs font-mono text-white">
        {environment ? (environment.displayName || environment.envType).toUpperCase() : 'UNKNOWN'}
      </td>
      <td className="px-4 py-3">
        <DeployJobStatusBadge status={job.status} />
      </td>
      <td className="px-4 py-3 text-xs font-mono text-nexus-muted">{job.triggeredBy}</td>
      <td className="px-4 py-3 text-xs font-mono text-nexus-muted">
        {job.executionModeSnapshot === 'managed' ? 'Managed' : 'BYO AWS'}
      </td>
      <td className="px-4 py-3">
        <Button variant="secondary" size="sm" to={`/dashboard/deployments/${job.id}`}>
          View
        </Button>
      </td>
    </tr>
  );
};
