import type { ReactNode } from 'react';

import { cn } from '../../utils/cn';

export interface BaseInteractiveCardProps {
  /** Top bar content (left side - typically badges) */
  topBarLeft: ReactNode;
  /** Top bar content (right side - typically metadata) */
  topBarRight: ReactNode;
  /** Main title */
  title: string;
  /** Optional title icon (top right) */
  titleIcon?: ReactNode;
  /** Description text */
  description: string;
  /** Tags to display */
  tags: string[];
  /** Footer content */
  footer: ReactNode;
  /** Click handler for entire card */
  onClick?: () => void;
  /** Additional card classes */
  className?: string;
}

/**
 * Shared base card for ResourceCard and TemplateCard
 * Features: hover effects, top bar, tags, footer
 */
export const BaseInteractiveCard = ({
  topBarLeft,
  topBarRight,
  title,
  titleIcon,
  description,
  tags,
  footer,
  onClick,
  className,
}: BaseInteractiveCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative flex flex-col h-full overflow-hidden transition-all duration-300',
        'bg-bg-panel border border-border-dim',
        'hover:border-brand-primary hover:translate-y-[-2px]',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 border-b border-border-dim bg-black/40 group-hover:border-brand-primary/30 transition-colors">
        <div className="flex items-center gap-2">{topBarLeft}</div>
        {topBarRight}
      </div>

      {/* Main Content */}
      <div className="p-6 flex-grow relative">
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="font-sans font-bold text-xl leading-tight text-white group-hover:text-brand-primary transition-colors">
            {title}
          </h3>
          {titleIcon}
        </div>

        <p className="font-mono text-xs text-text-primary/50 mb-6 leading-relaxed line-clamp-3 group-hover:text-text-primary/80 transition-colors">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {tags.map(tag => (
            <span
              key={tag}
              className="text-[10px] font-mono text-text-secondary border border-border-dim px-2 py-0.5 uppercase group-hover:border-brand-primary/30 group-hover:text-brand-primary/70 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border-dim bg-bg-app/50 flex justify-between items-center text-xs font-mono text-text-primary/50 group-hover:border-brand-primary/30 transition-colors">
        {footer}
      </div>
    </div>
  );
};

BaseInteractiveCard.displayName = 'BaseInteractiveCard';
