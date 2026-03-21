'use client';

import { Plus, Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/ui/shadcn/ui/button';
import { Card, CardContent } from '@/ui/shadcn/ui/card';
import { AsyncState } from '@/dashboard/shared/state/AsyncState';
import { DashboardPageHeader, PageLayout } from '@/dashboard/components/layout';

import { useProjects } from '../../projects/hooks/useProjects';
import { DeployJobTable } from '../components';
import { DeployModal } from '../components';
import { DEPLOY_JOB_STATUS_TABS, type DeployJobStatusFilter } from '../constants/deploy-job-status';
import { useDeployJobs } from '../hooks/useDeployJobs';

export const DeploymentsRoute = () => {
  const router = useRouter();
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const { data: projects = [] } = useProjects();
  const { data: jobs = [], isLoading, error, refetch } = useDeployJobs({}, true);
  const [jobFilter, setJobFilter] = useState<DeployJobStatusFilter>('all');

  const handleDeploy = () => {
    if (!selectedProjectId) return;
    const project = projects.find(p => p.id === selectedProjectId);
    if (!project) return;
    setIsDeploying(true);
    setTimeout(() => {
      router.push(`/dashboard/projects/${project.id}`);
    }, 300);
    setSelectedProjectId('');
    setShowDeployModal(false);
    setIsDeploying(false);
  };

  const filteredJobs = jobFilter === 'all' ? jobs : jobs.filter(job => job.status === jobFilter);

  return (
    <PageLayout className="pb-12">
      <DashboardPageHeader
        badge={{ icon: Rocket, label: 'DEPLOY JOBS' }}
        title="Deploy Jobs"
        subtitle="Create deploy jobs and monitor progress."
        actions={
          <Button onClick={() => setShowDeployModal(true)}>
            <Plus size={16} /> New Deploy Job
          </Button>
        }
      />

      <Card className="mb-6">
        <CardContent className="flex flex-wrap gap-2 pt-6">
          {DEPLOY_JOB_STATUS_TABS.map(tab => (
            <Button
              key={tab.value}
              variant={jobFilter === tab.value ? 'default' : 'outline'}
              onClick={() => setJobFilter(tab.value as DeployJobStatusFilter)}
            >
              {tab.label}
            </Button>
          ))}
        </CardContent>
      </Card>

      <AsyncState
        isLoading={isLoading}
        error={error}
        loadingMessage="Loading deploy jobs..."
        errorMessage="Failed to load deploy jobs."
        onRetry={() => refetch()}
      />

      {!isLoading && !error ? <DeployJobTable jobs={filteredJobs} /> : null}

      <DeployModal
        isOpen={showDeployModal}
        onClose={() => setShowDeployModal(false)}
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectedProjectChange={setSelectedProjectId}
        onDeploy={handleDeploy}
        isDeploying={isDeploying}
      />
    </PageLayout>
  );
};
