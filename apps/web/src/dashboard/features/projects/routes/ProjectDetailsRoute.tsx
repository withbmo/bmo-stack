'use client';

import { DEPLOY_JOB_STATUS } from '@pytholit/contracts';
import { toast } from '@/ui/system';
import { Loader2, Rocket, Terminal } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { Button, DashboardTabs, EmptyState, LoadingState } from '@/dashboard/components';
import { DashboardPageHeader, PageLayout } from '@/dashboard/components/layout';

import { DeployJobTable } from '../../deployments/components/DeployJobTable';
import { useCreateDeployJob, useDeployJobs } from '../../deployments/hooks/useDeployJobs';
import { useProject } from '../hooks/useProject';

function useProjectIdParam(): string | undefined {
  const params = useParams();
  const raw = params.projectId;
  return Array.isArray(raw) ? raw[0] : (raw ?? undefined);
}

export const ProjectDetailsRoute = () => {
  const projectId = useProjectIdParam();
  const router = useRouter();
  const [jobFilter, setJobFilter] = useState<'all' | string>('all');
  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: jobs = [] } = useDeployJobs({ projectId }, true);
  const createDeploy = useCreateDeployJob(projectId);

  const projectJobs = useMemo(() => {
    const filtered = jobFilter === 'all' ? jobs : jobs.filter(job => job.status === jobFilter);
    return filtered.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [jobs, jobFilter]);

  const handleDeploy = () => {
    createDeploy.mutate(undefined, {
      onError: err => {
        const msg = err instanceof Error ? err.message : 'Failed to start deploy';
        toast.error(msg);
      },
      onSuccess: () => {
        toast.success('Deploy job queued');
      },
    });
  };

  if (projectLoading) {
    return (
      <PageLayout className="pb-12">
        <LoadingState message="Loading project..." />
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout className="pb-12">
        <EmptyState message="Project not found." />
      </PageLayout>
    );
  }

  const statusTabs = [
    { value: 'all', label: 'ALL' },
    ...Object.values(DEPLOY_JOB_STATUS).map(v => ({ value: v, label: v.toUpperCase() })),
  ];

  return (
    <PageLayout className="pb-12">
      <DashboardPageHeader
        badge={{ icon: Terminal, label: 'PROJECT CONTROL' }}
        title={project.name}
        subtitle={`${project.framework} / ${project.region}`}
        actions={
          <>
            <Button onClick={() => router.push('/dashboard')}>
              Back to Projects
            </Button>
            <Button onClick={handleDeploy} disabled={createDeploy.isPending}>
              {createDeploy.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Rocket size={14} />
              )}
              Deploy Project
            </Button>
            <Button onClick={() => router.push(`/editor/${project.id}`)}>
              Open IDE
            </Button>
          </>
        }
      />

      <div className="space-y-4">
        <div>
          <h2 className="font-sans text-xl font-bold text-text-primary">Deploy Jobs</h2>
          <p className="mt-1 font-mono text-xs text-text-muted">
            Job history and step status for this project.
          </p>
        </div>
        <DashboardTabs tabs={statusTabs} active={jobFilter} onChange={setJobFilter} size="small" />
        <DeployJobTable jobs={projectJobs} />
      </div>
    </PageLayout>
  );
};
