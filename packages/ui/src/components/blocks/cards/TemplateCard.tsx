import { Box, Play, ShieldCheck, Star } from 'lucide-react';
import type { MouseEvent } from 'react';

import { BaseInteractiveCard } from '../_internal/BaseInteractiveCard';

export interface TemplateCardData {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  stars: number;
  isOfficial: boolean;
}

export interface TemplateCardProps {
  template: TemplateCardData;
  onUseTemplate?: (template: TemplateCardData) => void;
  actionHref?: string;
}

export const TemplateCard = ({
  template,
  onUseTemplate,
  actionHref = '/dashboard/new',
}: TemplateCardProps) => {
  const handleUseTemplate = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (onUseTemplate) {
      onUseTemplate(template);
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
          {onUseTemplate ? (
            <button
              onClick={handleUseTemplate}
              className="flex items-center gap-2 border border-border-dim bg-border-dim/20 px-4 py-2 font-mono text-xs font-bold transition-all hover:border-brand-primary hover:bg-brand-primary hover:text-white"
            >
              <Play size={10} fill="currentColor" /> USE_TEMPLATE
            </button>
          ) : (
            <a
              href={actionHref}
              className="flex items-center gap-2 border border-border-dim bg-border-dim/20 px-4 py-2 font-mono text-xs font-bold transition-all hover:border-brand-primary hover:bg-brand-primary hover:text-white"
            >
              <Play size={10} fill="currentColor" /> USE_TEMPLATE
            </a>
          )}
        </>
      }
    />
  );
};

TemplateCard.displayName = 'TemplateCard';
