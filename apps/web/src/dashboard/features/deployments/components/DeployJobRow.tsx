import { MotionFade } from '@pytholit/ui/ui';
import Link from 'next/link';

import { Button, DeployJobStatusBadge } from '@/dashboard/components';
import { formatTimestamp } from '@/shared/lib/date';
import type { DeployJob } from '@/shared/types';

interface DeployJobRowProps {
  job: DeployJob;
}

export const DeployJobRow = ({ job }: DeployJobRowProps) => {
  return (
    <MotionFade
      as="tr"
      className="border-b border-border-default/40 transition-colors hover:bg-white/2"
    >
      <td className="px-4 py-3 font-mono text-xs text-text-primary">
        {formatTimestamp(job.createdAt)}
      </td>
      <td className="px-4 py-3">
        <DeployJobStatusBadge status={job.status} />
      </td>
      <td className="px-4 py-3 font-mono text-xs text-text-muted">{job.triggeredBy}</td>
      <td className="px-4 py-3">
        <Button variant="secondary" size="sm" asChild>
          <Link href={`/dashboard/deployments/${job.id}`}>View</Link>
        </Button>
      </td>
    </MotionFade>
  );
};
