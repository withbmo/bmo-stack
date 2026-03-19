import { Terminal } from 'lucide-react';

import { DashboardPageHeader, PageLayout } from '@/dashboard/components';

import { ProjectList } from '../components/ProjectList';

export const ProjectListRoute = () => {
  return (
    <PageLayout className="pb-12">
      {/* Dashboard Header / HUD */}
      <DashboardPageHeader
        badge={{ icon: Terminal, label: 'PROJECTS' }}
        title={
          <>
            <span className="text-nexus-muted">COMMAND</span> CENTER
          </>
        }
        subtitle="Create and manage your projects"
      />

      <ProjectList />
    </PageLayout>
  );
};
