'use client';

import { toast } from '@/ui/system';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { Card, CardContent } from '@/ui/shadcn/ui/card';
import { Separator } from '@/ui/shadcn/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/ui/shadcn/ui/tabs';
import { archiveProject, type ProjectListState, restoreProject } from '@/shared/lib/projects';
import { queryKeys } from '@/shared/lib/query-keys';

import { useProjects } from '../hooks/useProjects';
import { ProjectCard } from './ProjectCard';

export const ProjectList = () => {
  const queryClient = useQueryClient();
  const [state, setState] = useState<ProjectListState>('active');
  const { data: projects, isLoading, error } = useProjects(state);
  const list = projects ?? [];

  const archiveMutation = useMutation({
    mutationFn: (projectId: string) => archiveProject(undefined, projectId),
    onSuccess: () => {
      toast.success('Project archived.');
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects('active') });
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects('archived') });
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects('all') });
    },
    onError: err => {
      const message = err instanceof Error ? err.message : 'Failed to archive project.';
      toast.error(message);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (projectId: string) => restoreProject(undefined, projectId),
    onSuccess: () => {
      toast.success('Project restored.');
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects('active') });
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects('archived') });
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects('all') });
    },
    onError: err => {
      const message = err instanceof Error ? err.message : 'Failed to restore project.';
      toast.error(message);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-between gap-4 pt-6">
            <div className="flex gap-2">
              <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
              <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="h-9 w-36 animate-pulse rounded-md bg-muted" />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="space-y-4 pt-6">
                <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-16 w-full animate-pulse rounded bg-muted" />
                <div className="h-8 w-full animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-destructive">
          Failed to load projects.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Separator />

      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Project View
          </p>
          <Tabs
            value={state}
            onValueChange={value => setState(value as ProjectListState)}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <p className="text-sm text-muted-foreground">
          {state === 'archived'
            ? 'Review and restore archived projects.'
            : 'Create and manage active projects.'}
        </p>
      </section>

      {list.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {state === 'archived'
              ? 'No archived projects yet.'
              : 'No projects yet. Create your first project to get started.'}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onArchive={projectId => archiveMutation.mutate(projectId)}
              onRestore={projectId => restoreMutation.mutate(projectId)}
              actionPending={archiveMutation.isPending || restoreMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
};
