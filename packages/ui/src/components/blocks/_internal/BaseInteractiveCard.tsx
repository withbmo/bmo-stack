import type { ReactNode } from 'react';

import { cn } from '../../../utils/cn';

export interface BaseInteractiveCardProps {
  topBarLeft: ReactNode;
  topBarRight: ReactNode;
  title: string;
  titleIcon?: ReactNode;
  description: string;
  tags: string[];
  footer: ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * Internal shared scaffold for block card layouts.
 *
 * This stays private to the package so we don't create another public card
 * abstraction that consumers start depending on directly.
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
        'group relative flex h-full flex-col overflow-hidden transition-all duration-300',
        'border border-border-dim bg-bg-panel',
        'hover:translate-y-[-2px] hover:border-brand-primary',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border-dim bg-black/40 p-4 transition-colors group-hover:border-brand-primary/30">
        <div className="flex items-center gap-2">{topBarLeft}</div>
        {topBarRight}
      </div>

      <div className="relative flex-grow p-6">
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 className="font-sans text-xl font-bold leading-tight text-white transition-colors group-hover:text-brand-primary">
            {title}
          </h3>
          {titleIcon}
        </div>

        <p className="mb-6 line-clamp-3 font-mono text-xs leading-relaxed text-text-primary/50 transition-colors group-hover:text-text-primary/80">
          {description}
        </p>

        <div className="mt-auto flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="border border-border-dim px-2 py-0.5 font-mono text-[10px] uppercase text-text-secondary transition-colors group-hover:border-brand-primary/30 group-hover:text-brand-primary/70"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border-dim bg-bg-app/50 p-4 font-mono text-xs text-text-primary/50 transition-colors group-hover:border-brand-primary/30">
        {footer}
      </div>
    </div>
  );
};

BaseInteractiveCard.displayName = 'BaseInteractiveCard';
