import { Brain, FileText, GitBranch, ShieldCheck, Star } from 'lucide-react';

import type { HubResource } from '../../../types';
import { BaseInteractiveCard } from './BaseInteractiveCard';

export interface ResourceCardProps {
  resource: HubResource;
}

export const ResourceCard = ({ resource }: ResourceCardProps) => {
  return (
    <BaseInteractiveCard
      topBarLeft={
        resource.type === 'readme' ? (
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-text-primary bg-border-dim/30 px-2 py-1 border border-border-dim">
            <FileText size={10} /> PROTOCOL
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-white bg-brand-primary/20 px-2 py-1 border border-brand-primary/50">
            <Brain size={10} /> COGNITION
          </div>
        )
      }
      topBarRight={
        <span className="text-[10px] font-mono text-text-secondary">{resource.updatedAt}</span>
      }
      title={resource.title}
      titleIcon={
        resource.verified && (
          <div className="text-brand-primary" title="Verified Human Knowledge">
            <ShieldCheck size={18} />
          </div>
        )
      }
      description={resource.description}
      tags={resource.tags}
      footer={
        <>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-border-dim/20 border border-border-dim flex items-center justify-center text-[10px] text-white font-bold group-hover:border-brand-primary/50 transition-colors">
              {resource.author.charAt(0).toUpperCase()}
            </div>
            <span className="group-hover:text-white transition-colors">{resource.author}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star size={12} className="group-hover:text-white transition-colors" />
              {resource.stars}
            </div>
            <div className="flex items-center gap-1">
              <GitBranch size={12} className="group-hover:text-white transition-colors" />
              {resource.forks}
            </div>
          </div>
        </>
      }
    />
  );
};

ResourceCard.displayName = 'ResourceCard';
