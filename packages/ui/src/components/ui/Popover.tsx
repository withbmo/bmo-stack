'use client';

import { Slot } from '@radix-ui/react-slot';
import type { HTMLAttributes, ReactNode } from 'react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

import { MotionPopover, Presence } from '../../motion';
import { cn } from '../../utils/cn';

export interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  triggerAsChild?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: 'start' | 'end';
  className?: string;
  panelClassName?: string;
}

export const Popover = ({
  trigger,
  children,
  triggerAsChild = false,
  open,
  defaultOpen = false,
  onOpenChange,
  align = 'start',
  className,
  panelClassName,
}: PopoverProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;
  const baseId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const setOpen = (nextOpen: boolean) => {
    if (open === undefined) {
      setUncontrolledOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const alignmentClasses = useMemo(
    () => (align === 'end' ? 'right-0' : 'left-0'),
    [align]
  );

  const TriggerComponent = triggerAsChild ? Slot : 'button';

  return (
    <div ref={containerRef} className={cn('relative inline-flex', className)}>
      <TriggerComponent
        {...(!triggerAsChild ? { type: 'button' as const } : {})}
        onClick={() => setOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`${baseId}-panel`}
        className={cn(
          !triggerAsChild &&
            'inline-flex items-center justify-center gap-2 border border-border-dim bg-bg-panel px-3 py-2 font-mono text-xs uppercase tracking-wider text-text-secondary transition-colors hover:border-brand-primary hover:text-text-primary'
        )}
      >
        {trigger}
      </TriggerComponent>

      <Presence>
        {isOpen ? (
          <MotionPopover
            id={`${baseId}-panel`}
            className={cn(
              'absolute top-[calc(100%+0.75rem)] z-[var(--z-overlay)] min-w-56 border border-border-dim bg-bg-panel p-4 shadow-[var(--shadow-panel)]',
              alignmentClasses,
              panelClassName
            )}
          >
            {children}
          </MotionPopover>
        ) : null}
      </Presence>
    </div>
  );
};

export interface PopoverSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const PopoverSection = ({ className, children, ...props }: PopoverSectionProps) => (
  <div className={cn('space-y-2', className)} {...props}>
    {children}
  </div>
);
