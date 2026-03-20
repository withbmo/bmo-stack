'use client';

import { DEPLOY_JOB_STATUS } from '@pytholit/contracts';
import { Rocket } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Button, DeployJobStatusBadge, EmptyState } from '@/dashboard/components';
import { AsyncState } from '@/dashboard/shared/state/AsyncState';
import { DashboardPageHeader, PageLayout } from '@/shared/components/layout';
import { formatTimestamp } from '@/shared/lib/date';

import { DeployJobStepper } from '../components/DeployJobStepper';
import { useCancelDeployJob, useDeployJob } from '../hooks/useDeployJobs';

export const DeployJobDetailsRoute = () => {
  const params = useParams();
  const jobId = typeof params.jobId === 'string' ? params.jobId : params.jobId?.[0];
  const router = useRouter();
  const { data: job, isLoading, error, refetch } = useDeployJob(jobId, true);
  const cancelJob = useCancelDeployJob(job?.projectId);

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
            {job.status === DEPLOY_JOB_STATUS.QUEUED || job.status === DEPLOY_JOB_STATUS.RUNNING ? (
              <Button variant="danger" size="sm" onClick={() => cancelJob.mutate(job.id)}>
                Cancel
              </Button>
            ) : null}
          </>
        }
      />

      {/* Status badges below header */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <DeployJobStatusBadge status={job.status} />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="border border-border-dim bg-bg-panel p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
            Created
          </div>
          <div className="mt-2 font-mono text-sm text-text-primary">
            {formatTimestamp(job.createdAt)}
          </div>
        </div>
        <div className="border border-border-dim bg-bg-panel p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
            Started
          </div>
          <div className="mt-2 font-mono text-sm text-text-primary">
            {formatTimestamp(job.startedAt) === '—' ? 'Pending' : formatTimestamp(job.startedAt)}
          </div>
        </div>
        <div className="border border-border-dim bg-bg-panel p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
            Finished
          </div>
          <div className="mt-2 font-mono text-sm text-text-primary">
            {formatTimestamp(job.finishedAt) === '—'
              ? 'In progress'
              : formatTimestamp(job.finishedAt)}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="font-sans text-xl font-bold text-text-primary">Steps</h2>
          <p className="mt-1 font-mono text-xs text-text-muted">
            Job runner updates every 1-2 seconds.
          </p>
        </div>
        <DeployJobStepper steps={job.steps} />
      </div>
    </PageLayout>
  );
};
