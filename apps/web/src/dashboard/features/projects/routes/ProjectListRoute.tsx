import { Terminal } from 'lucide-react';
import Link from 'next/link';

import { DashboardPageHeader, PageLayout } from '@/dashboard/components';
import { Button } from '@/ui/shadcn/ui/button';

import { ProjectList } from '../components/ProjectList';

export const ProjectListRoute = () => {
  return (
    <PageLayout className="pb-12">
      <DashboardPageHeader
        badge={{ icon: Terminal, label: 'PROJECTS' }}
        title="Projects"
        subtitle="Create and manage your projects."
        actions={
          <Button asChild>
            <Link href="/dashboard/new">New Project</Link>
          </Button>
        }
      />

      <ProjectList />
    </PageLayout>
  );
};
