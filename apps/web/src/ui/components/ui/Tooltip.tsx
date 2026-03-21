'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { useId, useState } from 'react';

import { Presence } from '../../motion';
import { cn } from '../../utils/cn';

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'content'> {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'bottom';
}

export const Tooltip = ({
  content,
  children,
  side = 'top',
  className,
  ...props
}: TooltipProps) => {
  const [open, setOpen] = useState(false);
  const id = useId();

  const positionClass =
    side === 'bottom'
      ? 'top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2'
      : 'bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2';

  return (
    <span
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      aria-describedby={open ? id : undefined}
      {...props}
    >
      {children}
      <Presence>
        {open ? (
          <span
            id={id}
            role="tooltip"
            className={cn(
              'pointer-events-none absolute z-[var(--z-toast)] inline-flex whitespace-nowrap border border-border-dim bg-bg-canvas px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-text-primary shadow-[var(--shadow-subtle)]',
              positionClass
            )}
          >
            {content}
          </span>
        ) : null}
      </Presence>
    </span>
  );
};
