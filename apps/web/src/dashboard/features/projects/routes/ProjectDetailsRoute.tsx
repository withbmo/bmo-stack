'use client';

import { DEPLOY_JOB_STATUS } from '@pytholit/contracts';
import { Rocket, Terminal } from 'lucide-react';
import { useParams,useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button, DashboardTabs, EmptyState,LoadingState } from '@/dashboard/components';
import { DashboardPageHeader,PageLayout } from '@/shared/components/layout';

import { DeployJobTable } from '../../deployments/components/DeployJobTable';
import { useCreateDeployJob,useDeployJobs } from '../../deployments/hooks/useDeployJobs';
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
            <Button variant="secondary" size="sm" onClick={() => router.push('/dashboard')}>
              Back to Projects
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDeploy}
              isLoading={createDeploy.isPending}
            >
              <Rocket size={14} /> Deploy Project
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/editor/${project.id}`)}
            >
              Open IDE
            </Button>
          </>
        }
      />

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-sans font-bold text-white">Deploy Jobs</h2>
          <p className="text-xs font-mono text-nexus-muted mt-1">
            Job history and step status for this project.
          </p>
        </div>
        <DashboardTabs
          tabs={statusTabs}
          active={jobFilter}
          onChange={setJobFilter}
          size="small"
        />
        <DeployJobTable jobs={projectJobs} />
      </div>
    </PageLayout>
  );
};
