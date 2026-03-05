'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button, Card, Skeleton } from '@/dashboard/components';

import { useProjects } from '../hooks/useProjects';
import { ProjectCard } from './ProjectCard';

export const ProjectList = () => {
  const router = useRouter();
  const { data: projects, isLoading, error } = useProjects();
  const list = projects ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="h-64 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="mt-8 space-y-2">
              <Skeleton className="h-20 w-full" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 font-mono text-sm">Failed to load projects.</div>;
  }

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <Card className="mb-6 flex items-center justify-between bg-bg-surface p-4 pb-6 pr-6">
        <div className="flex gap-4 font-mono text-sm">
          <Button
            variant="ghost"
            size="sm"
            className="px-0 py-0 text-sm text-white border-b border-brand-primary rounded-none"
          >
            Active Runtimes
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="px-0 py-0 text-sm text-text-secondary hover:text-white"
          >
            Archived
          </Button>
        </div>
        <div className="relative z-0">
          <Button size="sm" to="/dashboard/new">
            <Plus size={16} /> NEW PROJECT
          </Button>
        </div>
      </Card>

      {list.length === 0 ? (
        <Card className="bg-bg-panel p-8 text-center text-nexus-muted font-mono text-sm">
          No projects yet. Create your first project to get started.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}

          {/* Create New Placeholder */}
          <Button
            onClick={() => router.push('/dashboard/new')}
            variant="secondary"
            className="group min-h-[240px] w-full border-2 border-dashed border-border-dim bg-black/20 hover:border-brand-primary/50 hover:bg-brand-primary/5 flex-col items-center justify-center"
          >
            <div className="w-12 h-12 rounded-full bg-border-dim/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus
                size={24}
                className="text-text-secondary group-hover:text-brand-primary transition-colors"
              />
            </div>
            <span className="font-mono text-xs text-text-secondary group-hover:text-white transition-colors">
              INITIALIZE CONTAINER
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};
