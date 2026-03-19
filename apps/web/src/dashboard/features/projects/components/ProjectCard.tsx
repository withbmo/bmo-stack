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
            <div className="w-10 h-10 bg-nexus-gray/10 border border-nexus-gray flex items-center justify-center text-nexus-purple group-hover:bg-nexus-purple group-hover:text-white transition-colors">
              <Box size={20} />
            </div>
            <div>
              <h3 className="font-sans font-bold text-white text-lg leading-none mb-1 group-hover:text-nexus-purple transition-colors">
                {project.name}
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-mono text-nexus-muted">
                <Globe size={10} /> {project.region.toUpperCase()}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="px-0 py-0 text-nexus-muted hover:text-white"
            onClick={e => e.stopPropagation()}
          >
            <MoreVertical size={16} />
          </Button>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="bg-black/50 p-2 border border-nexus-gray/50">
            <div className="text-[9px] text-nexus-muted mb-0.5">FRAMEWORK</div>
            <div className="text-xs text-white font-mono">{project.framework}</div>
          </div>
          <div className="bg-black/50 p-2 border border-nexus-gray/50">
            <div className="text-[9px] text-nexus-muted mb-0.5">DEPLOYED</div>
            <div className="text-xs text-white font-mono">
              {formatTimestamp(project.lastDeployed)}
            </div>
          </div>
        </div>

        {/* Footer / Status */}
        <div className="mt-auto flex items-center justify-between border-t border-nexus-gray/30 pt-4">
          <StatusBadge status={project.status} />

          <div className="flex gap-2" onClick={e => e.stopPropagation()}>
            <Button
              variant="secondary"
              size="sm"
              className="px-2 py-1 border-border-dim hover:border-brand-primary text-nexus-muted hover:text-brand-primary"
              title="Open IDE"
              onClick={() => router.push(`/editor/${project.id}`)}
            >
              IDE
            </Button>
            {project.status === 'running' ? (
              <Button
                variant="secondary"
                size="sm"
                className="px-2 py-1 border-border-dim hover:border-red-500 text-nexus-muted hover:text-red-500"
                title="Stop"
                disabled={project.lifecycleState === 'archived'}
              >
                <Square size={12} className="fill-current" />
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                className="px-2 py-1 border-border-dim hover:border-brand-accent text-nexus-muted hover:text-brand-accent"
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
                className="px-2 py-1 border-border-dim hover:border-brand-accent text-nexus-muted hover:text-brand-accent"
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
                className="px-2 py-1 border-border-dim hover:border-yellow-400 text-nexus-muted hover:text-yellow-400"
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
              className="px-2 py-1 border-border-dim hover:border-brand-primary text-nexus-muted hover:text-brand-primary"
              title="Settings"
            >
              <Settings size={12} />
            </Button>
          </div>
        </div>

        {/* Decorative Corners */}
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-nexus-gray group-hover:border-nexus-purple transition-colors"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-nexus-gray group-hover:border-nexus-purple transition-colors"></div>
      </Card>
    </div>
  );
};

ProjectCard.displayName = 'ProjectCard';
