'use client';

import { Archive, Box, Globe, MoreVertical, Play, RotateCcw, Settings, Square } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button, Card, StatusBadge } from '@/dashboard/components';
import { formatTimestamp } from '@/shared/lib/date';

import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onArchive?: (projectId: string) => void;
  onRestore?: (projectId: string) => void;
  actionPending?: boolean;
}

export const ProjectCard = ({ project, onArchive, onRestore, actionPending = false }: ProjectCardProps) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/dashboard/projects/${project.id}`)}
      className="cursor-pointer h-full"
    >
      <Card
        variant="interactive"
        padding="md"
        className="group relative h-full hover:shadow-[0_0_20px_rgba(109,40,217,0.15)]"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border border-border-default bg-border-default/10 text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white">
              <Box size={20} />
            </div>
            <div>
              <h3 className="mb-1 font-sans text-lg font-bold leading-none text-text-primary transition-colors group-hover:text-brand-primary">
                {project.name}
              </h3>
              <div className="flex items-center gap-2 font-mono text-[10px] text-text-muted">
                <Globe size={10} /> {project.region.toUpperCase()}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="px-0 py-0 text-text-muted hover:text-text-primary"
            onClick={e => e.stopPropagation()}
          >
            <MoreVertical size={16} />
          </Button>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="border border-border-default/50 bg-black/50 p-2">
            <div className="mb-0.5 text-[9px] text-text-muted">FRAMEWORK</div>
            <div className="font-mono text-xs text-text-primary">{project.framework}</div>
          </div>
          <div className="border border-border-default/50 bg-black/50 p-2">
            <div className="mb-0.5 text-[9px] text-text-muted">DEPLOYED</div>
            <div className="font-mono text-xs text-text-primary">
              {formatTimestamp(project.lastDeployed)}
            </div>
          </div>
        </div>

        {/* Footer / Status */}
        <div className="mt-auto flex items-center justify-between border-t border-border-default/30 pt-4">
          <StatusBadge status={project.status} />

          <div className="flex gap-2" onClick={e => e.stopPropagation()}>
            <Button
              variant="secondary"
              size="sm"
              className="px-2 py-1 text-text-muted hover:border-brand-primary hover:text-brand-primary"
              title="Open IDE"
              onClick={() => router.push(`/editor/${project.id}`)}
            >
              IDE
            </Button>
            {project.status === 'running' ? (
              <Button
                variant="secondary"
                size="sm"
                className="px-2 py-1 text-text-muted hover:border-red-500 hover:text-red-500"
                title="Stop"
                disabled={project.lifecycleState === 'archived'}
              >
                <Square size={12} className="fill-current" />
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                className="px-2 py-1 text-text-muted hover:border-brand-accent hover:text-brand-accent"
                title="Start"
                disabled={project.lifecycleState === 'archived'}
              >
                <Play size={12} className="fill-current" />
              </Button>
            )}
            {project.lifecycleState === 'archived' ? (
              <Button
                variant="secondary"
                size="sm"
                className="px-2 py-1 text-text-muted hover:border-brand-accent hover:text-brand-accent"
                title="Restore"
                disabled={actionPending}
                onClick={() => onRestore?.(project.id)}
              >
                <RotateCcw size={12} />
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                className="px-2 py-1 text-text-muted hover:border-yellow-400 hover:text-yellow-400"
                title="Archive"
                disabled={actionPending}
                onClick={() => onArchive?.(project.id)}
              >
                <Archive size={12} />
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              className="px-2 py-1 text-text-muted hover:border-brand-primary hover:text-brand-primary"
              title="Settings"
            >
              <Settings size={12} />
            </Button>
          </div>
        </div>

        {/* Decorative Corners */}
        <div className="absolute right-0 top-0 h-2 w-2 border-r border-t border-border-default transition-colors group-hover:border-brand-primary"></div>
        <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-border-default transition-colors group-hover:border-brand-primary"></div>
      </Card>
    </div>
  );
};

ProjectCard.displayName = 'ProjectCard';
