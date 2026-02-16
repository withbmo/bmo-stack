'use client';

import { Rocket, Terminal } from 'lucide-react';
import { useParams,useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button, DashboardTabs, EmptyState,LoadingState } from '@/dashboard/components';
import { DashboardPageHeader,PageLayout } from '@/shared/components/layout';
import type { Environment } from '@/shared/types';

import { DeployJobTable } from '../../deployments/components/DeployJobTable';
import { useCreateDeployJob,useDeployJobs } from '../../deployments/hooks/useDeployJobs';
import { EnvironmentCreateModal } from '../components/EnvironmentCreateModal';
import { EnvironmentList } from '../components/EnvironmentList';
import {
  useCreateEnvironment,
  useEnvironments,
  useUpdateEnvironment,
} from '../hooks/useEnvironments';
import { useProject } from '../hooks/useProject';

const tabs = ['environments', 'deployments'] as const;

function useProjectIdParam(): string | undefined {
  const params = useParams();
  const raw = params.projectId;
  return Array.isArray(raw) ? raw[0] : (raw ?? undefined);
}

export const ProjectDetailsRoute = () => {
  const projectId = useProjectIdParam();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('environments');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: environments = [], isLoading: envLoading } = useEnvironments();
  const { data: jobs = [] } = useDeployJobs({ projectId }, activeTab === 'deployments');
  const createEnv = useCreateEnvironment();
  const updateEnv = useUpdateEnvironment();
  const createDeploy = useCreateDeployJob(projectId);
  const [jobFilter, setJobFilter] = useState<'all' | string>('all');

  const environmentLookup = useMemo(() => {
    return environments.reduce<Record<string, Environment>>((acc, env) => {
      acc[env.id] = env;
      return acc;
    }, {});
  }, [environments]);

  const projectJobs = useMemo(() => {
    const filtered = jobFilter === 'all' ? jobs : jobs.filter(job => job.status === jobFilter);
    return filtered.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [jobs, jobFilter]);

  const handleDeploy = (envId: string) => {
    createDeploy.mutate(envId, {
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

  const mainTabs = [
    { value: 'environments', label: 'ENVIRONMENTS' },
    { value: 'deployments', label: 'DEPLOYMENTS' },
  ];

  const statusTabs = [
    { value: 'all', label: 'ALL' },
    { value: 'queued', label: 'QUEUED' },
    { value: 'running', label: 'RUNNING' },
    { value: 'succeeded', label: 'SUCCEEDED' },
    { value: 'failed', label: 'FAILED' },
    { value: 'canceled', label: 'CANCELED' },
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
              onClick={() => router.push(`/editor/${project.id}`)}
            >
              Open IDE
            </Button>
          </>
        }
      />

      <DashboardTabs
        tabs={mainTabs}
        active={activeTab}
        onChange={value => setActiveTab(value as typeof activeTab)}
        size="small"
        className="mb-8"
      />

      {activeTab === 'environments' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-sans font-bold text-white">Environments</h2>
              <p className="text-xs font-mono text-nexus-muted mt-1">
                Execution mode and visibility snapshots are stored per deploy.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(true)}>
              <Rocket size={14} /> Add Environment
            </Button>
          </div>

          {envLoading ? (
            <LoadingState message="Loading environments..." />
          ) : (
            <EnvironmentList
              environments={environments}
              onUpdate={(envId, updates) =>
                updateEnv.mutate(
                  {
                    envId,
                    payload: {
                      executionMode: updates.executionMode,
                      visibility: updates.visibility,
                      region: updates.region,
                      config: updates.config ?? null,
                    },
                  },
                  {
                    onError: err => {
                      const msg =
                        err instanceof Error ? err.message : 'Failed to update environment';
                      toast.error(msg);
                    },
                  }
                )
              }
              onDeploy={handleDeploy}
              activeDeployId={createDeploy.isPending ? (createDeploy.variables ?? null) : null}
            />
          )}
        </div>
      ) : (
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
          <DeployJobTable jobs={projectJobs} environmentLookup={environmentLookup} />
        </div>
      )}
      <EnvironmentCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        isSubmitting={createEnv.isPending}
        onSubmit={payload =>
          createEnv.mutate(payload, {
            onSuccess: () => {
              toast.success('Environment created');
              setShowCreateModal(false);
            },
            onError: err => {
              const msg = err instanceof Error ? err.message : 'Failed to create environment';
              toast.error(msg);
            },
          })
        }
      />
    </PageLayout>
  );
};
