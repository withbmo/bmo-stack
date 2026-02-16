'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button,Skeleton } from '@/dashboard/components';

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
          <div key={i} className="h-64 border border-border-dim bg-bg-panel p-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="mt-8 space-y-2">
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
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
      <div className="flex justify-between items-center bg-bg-surface border border-border-dim p-4 pb-6 pr-6 mb-6">
        <div className="flex gap-4 font-mono text-sm">
          <button className="text-white border-b border-brand-primary pb-0.5">
            Active Runtimes
          </button>
          <button className="text-text-secondary hover:text-white transition-colors">
            Archived
          </button>
        </div>
        <div className="relative z-0">
          <Button size="sm" to="/dashboard/new">
            <Plus size={16} /> NEW PROJECT
          </Button>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="border border-border-dim bg-bg-panel p-8 text-center text-nexus-muted font-mono text-sm">
          No projects yet. Create your first project to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}

          {/* Create New Placeholder */}
          <button
            onClick={() => router.push('/dashboard/new')}
            className="group border-2 border-dashed border-border-dim hover:border-brand-primary/50 bg-black/20 flex flex-col items-center justify-center min-h-[240px] transition-all hover:bg-brand-primary/5"
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
          </button>
        </div>
      )}
    </div>
  );
};
