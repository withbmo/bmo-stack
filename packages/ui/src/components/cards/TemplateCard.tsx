import type { MouseEvent } from 'react';
import { Star, ShieldCheck, Play, Box } from 'lucide-react';
import type { Template } from '../../types';
import { BaseInteractiveCard } from './BaseInteractiveCard';

interface TemplateCardProps {
  template: Template;
  onUseTemplate?: (template: Template) => void;
}

export const TemplateCard = ({ template, onUseTemplate }: TemplateCardProps) => {
  const handleUseTemplate = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (onUseTemplate) {
      onUseTemplate(template);
      return;
    }

    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard/new';
    }
  };

  return (
    <BaseInteractiveCard
      topBarLeft={
        template.isOfficial ? (
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-bg-app bg-brand-accent px-2 py-1">
            <ShieldCheck size={10} /> OFFICIAL
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-text-secondary bg-border-dim/10 px-2 py-1 border border-border-dim">
            <Box size={10} /> COMMUNITY
          </div>
        )
      }
      topBarRight={
        <div className="flex items-center gap-1 text-[10px] font-mono text-text-secondary">
          <Star size={10} className="text-yellow-500" /> {template.stars}
        </div>
      }
      title={template.title}
      description={template.description}
      tags={template.tags}
      footer={
        <>
          <div className="font-mono text-[10px] text-text-secondary">
            by <span className="text-white">{template.author}</span>
          </div>
          <button
            onClick={handleUseTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-border-dim/20 hover:bg-brand-primary hover:text-white text-xs font-mono font-bold transition-all border border-border-dim hover:border-brand-primary"
          >
            <Play size={10} fill="currentColor" /> USE_TEMPLATE
          </button>
        </>
      }
    />
  );
};

TemplateCard.displayName = 'TemplateCard';
