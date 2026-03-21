'use client';

import { Archive, Box, Play, RotateCcw, Settings, Square } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { MouseEvent } from 'react';

import { Badge } from '@/ui/shadcn/ui/badge';
import { Button } from '@/ui/shadcn/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/ui/shadcn/ui/card';
import { formatTimestamp } from '@/shared/lib/date';

import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onArchive?: (projectId: string) => void;
  onRestore?: (projectId: string) => void;
  actionPending?: boolean;
}

function statusBadgeVariant(status: Project['status']) {
  if (status === 'running') return 'default' as const;
  if (status === 'error') return 'destructive' as const;
  return 'secondary' as const;
}

export const ProjectCard = ({
  project,
  onArchive,
  onRestore,
  actionPending = false,
}: ProjectCardProps) => {
  const router = useRouter();

  const stopPropagation = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <Card
      className="h-full cursor-pointer transition-colors hover:bg-accent/30"
      onClick={() => router.push(`/dashboard/projects/${project.id}`)}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md border bg-muted">
              <Box size={16} />
            </div>
            <CardTitle className="text-lg">{project.name}</CardTitle>
          </div>
          <Badge variant={statusBadgeVariant(project.status)}>{project.status}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>Framework: {project.framework}</p>
        <p>Region: {project.region}</p>
        <p>Last deployed: {formatTimestamp(project.lastDeployed)}</p>
      </CardContent>

      <CardFooter onClick={stopPropagation} className="mt-auto flex items-center justify-between gap-2">
        <Button size="sm" variant="outline" onClick={() => router.push(`/editor/${project.id}`)}>
          IDE
        </Button>
        <div className="flex items-center gap-2">
          {project.status === 'running' ? (
            <Button size="icon-sm" variant="outline" title="Stop" disabled={project.lifecycleState === 'archived'}>
              <Square size={12} className="fill-current" />
            </Button>
          ) : (
            <Button size="icon-sm" variant="outline" title="Start" disabled={project.lifecycleState === 'archived'}>
              <Play size={12} className="fill-current" />
            </Button>
          )}

          {project.lifecycleState === 'archived' ? (
            <Button
              size="icon-sm"
              variant="outline"
              title="Restore"
              disabled={actionPending}
              onClick={() => onRestore?.(project.id)}
            >
              <RotateCcw size={12} />
            </Button>
          ) : (
            <Button
              size="icon-sm"
              variant="outline"
              title="Archive"
              disabled={actionPending}
              onClick={() => onArchive?.(project.id)}
            >
              <Archive size={12} />
            </Button>
          )}

          <Button size="icon-sm" variant="outline" title="Settings">
            <Settings size={12} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

ProjectCard.displayName = 'ProjectCard';
