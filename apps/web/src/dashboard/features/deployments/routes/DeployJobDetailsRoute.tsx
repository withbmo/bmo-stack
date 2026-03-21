'use client';

import { DEPLOY_JOB_STATUS } from '@pytholit/contracts';
import { Rocket } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { EmptyState } from '@/dashboard/components';
import { AsyncState } from '@/dashboard/shared/state/AsyncState';
import { DashboardPageHeader, PageLayout } from '@/dashboard/components/layout';
import { Badge } from '@/ui/shadcn/ui/badge';
import { Button } from '@/ui/shadcn/ui/button';
import { Card, CardContent } from '@/ui/shadcn/ui/card';
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
            <Button onClick={() => router.back()}>
              Back
            </Button>
            {job.status === DEPLOY_JOB_STATUS.QUEUED || job.status === DEPLOY_JOB_STATUS.RUNNING ? (
              <Button onClick={() => cancelJob.mutate(job.id)}>
                Cancel
              </Button>
            ) : null}
          </>
        }
      />

      {/* Status badges below header */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Badge variant="secondary">{job.status}</Badge>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Created</p>
            <p className="mt-2 text-sm">{formatTimestamp(job.createdAt)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Started</p>
            <p className="mt-2 text-sm">
              {formatTimestamp(job.startedAt) === '—' ? 'Pending' : formatTimestamp(job.startedAt)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Finished</p>
            <p className="mt-2 text-sm">
              {formatTimestamp(job.finishedAt) === '—'
                ? 'In progress'
                : formatTimestamp(job.finishedAt)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Steps</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Job runner updates every 1-2 seconds.
          </p>
        </div>
        <DeployJobStepper steps={job.steps} />
      </div>
    </PageLayout>
  );
};
