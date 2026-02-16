'use client';

import { useQuery } from '@tanstack/react-query';
import { Rocket } from 'lucide-react';
import { useParams,useRouter } from 'next/navigation';

import { Button, DeployJobStatusBadge, EmptyState } from '@/dashboard/components';
import { AsyncState } from '@/dashboard/shared/state/AsyncState';
import { useAuth } from '@/shared/auth';
import { DashboardPageHeader,PageLayout } from '@/shared/components/layout';
import { formatTimestamp } from '@/shared/lib/date';
import { getEnvironment } from '@/shared/lib/environments';
import { queryKeys } from '@/shared/lib/query-keys';

import { DeployJobStepper } from '../components/DeployJobStepper';
import { useCancelDeployJob,useDeployJob } from '../hooks/useDeployJobs';

export const DeployJobDetailsRoute = () => {
  const params = useParams();
  const jobId = typeof params.jobId === 'string' ? params.jobId : params.jobId?.[0];
  const router = useRouter();
  const { data: job, isLoading, error, refetch } = useDeployJob(jobId, true);
  const cancelJob = useCancelDeployJob(job?.projectId);
  const { user, hydrated } = useAuth();
  const { data: environment } = useQuery({
    queryKey: job?.environmentId
      ? queryKeys.environment(job.environmentId)
      : ['environment', undefined],
    queryFn: async () => {
      if (!hydrated || !user || !job?.environmentId) return null;
      return getEnvironment(undefined, job.environmentId);
    },
    enabled: hydrated && !!user && !!job?.environmentId,
  });

  if (isLoading || error) {
    return (
      <PageLayout className="pb-12">
        <AsyncState
          isLoading={isLoading}
          error={error}
          loadingMessage="Loading deploy job..."
          errorMessage="Failed to load deploy job."
          onRetry={() => refetch()}
        />
      </PageLayout>
    );
  }

  if (!job) {
    return (
      <PageLayout className="pb-12">
        <EmptyState message="Deploy job not found." />
      </PageLayout>
    );
  }

  return (
    <PageLayout className="pb-12">
      <DashboardPageHeader
        badge={{ icon: Rocket, label: 'DEPLOY JOB' }}
        title={job.id}
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => router.back()}>
              Back
            </Button>
            {job.status === 'queued' || job.status === 'running' ? (
              <Button variant="danger" size="sm" onClick={() => cancelJob.mutate(job.id)}>
                Cancel
              </Button>
            ) : null}
          </>
        }
      />

      {/* Status badges below header */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <DeployJobStatusBadge status={job.status} />
        <div className="text-xs font-mono text-nexus-muted">
          Env: {environment ? environment.name.toUpperCase() : 'UNKNOWN'}
        </div>
        <div className="text-xs font-mono text-nexus-muted">
          Mode: {job.executionModeSnapshot === 'managed' ? 'Managed' : 'BYO AWS'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-bg-panel border border-border-dim p-4">
          <div className="text-[10px] font-mono text-nexus-muted uppercase tracking-wider">
            Created
          </div>
          <div className="text-sm font-mono text-white mt-2">{formatTimestamp(job.createdAt)}</div>
        </div>
        <div className="bg-bg-panel border border-border-dim p-4">
          <div className="text-[10px] font-mono text-nexus-muted uppercase tracking-wider">
            Started
          </div>
          <div className="text-sm font-mono text-white mt-2">
            {formatTimestamp(job.startedAt) === '—' ? 'Pending' : formatTimestamp(job.startedAt)}
          </div>
        </div>
        <div className="bg-bg-panel border border-border-dim p-4">
          <div className="text-[10px] font-mono text-nexus-muted uppercase tracking-wider">
            Finished
          </div>
          <div className="text-sm font-mono text-white mt-2">
            {formatTimestamp(job.finishedAt) === '—'
              ? 'In progress'
              : formatTimestamp(job.finishedAt)}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-sans font-bold text-white">Steps</h2>
          <p className="text-xs font-mono text-nexus-muted mt-1">
            Job runner updates every 1-2 seconds.
          </p>
        </div>
        <DeployJobStepper steps={job.steps} />
      </div>
    </PageLayout>
  );
};
