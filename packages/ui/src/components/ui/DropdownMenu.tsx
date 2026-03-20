'use client';

import { Slot } from '@radix-ui/react-slot';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { createContext, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';

import { Presence } from '../../motion';
import { cn } from '../../utils/cn';

type DropdownMenuContextValue = {
  contentId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext(component: string) {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error(`${component} must be used within <DropdownMenu>.`);
  }
  return context;
}

export interface DropdownMenuProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const DropdownMenu = ({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
}: DropdownMenuProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const contentId = useId();
  const isOpen = open ?? uncontrolledOpen;

  const context = useMemo<DropdownMenuContextValue>(
    () => ({
      contentId,
      open: isOpen,
      setOpen: nextOpen => {
        if (open === undefined) {
          setUncontrolledOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
      },
    }),
    [contentId, isOpen, onOpenChange, open]
  );

  return <DropdownMenuContext.Provider value={context}>{children}</DropdownMenuContext.Provider>;
};

export interface DropdownMenuTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  asChild?: boolean;
}

export const DropdownMenuTrigger = ({
  children,
  asChild = false,
  className,
  ...props
}: DropdownMenuTriggerProps) => {
  const context = useDropdownMenuContext('DropdownMenuTrigger');
  const Component = asChild ? Slot : 'button';

  return (
    <Component
      {...(!asChild ? { type: 'button' as const } : {})}
      aria-expanded={context.open}
      aria-haspopup="menu"
      aria-controls={context.contentId}
      className={cn(className)}
      onClick={() => context.setOpen(!context.open)}
      {...props}
    >
      {children}
    </Component>
  );
};

export interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  align?: 'start' | 'end';
}

export const DropdownMenuContent = ({
  children,
  className,
  align = 'start',
  ...props
}: DropdownMenuContentProps) => {
  const context = useDropdownMenuContext('DropdownMenuContent');
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!context.open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        context.setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        context.setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [context]);

  return (
    <Presence>
      {context.open ? (
        <div
          ref={containerRef}
          id={context.contentId}
          role="menu"
          className={cn(
            'absolute bottom-full z-[var(--z-overlay)] mb-1 min-w-[180px] border border-border-default bg-bg-panel shadow-[var(--shadow-panel)]',
            align === 'end' ? 'right-0' : 'left-0',
            className
          )}
          {...props}
        >
          {children}
        </div>
      ) : null}
    </Presence>
  );
};

export interface DropdownMenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean;
}

export const DropdownMenuItem = ({
  className,
  inset = false,
  onClick,
  children,
  ...props
}: DropdownMenuItemProps) => {
  const context = useDropdownMenuContext('DropdownMenuItem');

  return (
    <button
      type="button"
      role="menuitem"
      className={cn(
        'flex w-full items-start gap-2.5 px-3 py-2 text-left font-mono text-[11px] transition-colors',
        inset && 'pl-6',
        className
      )}
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          context.setOpen(false);
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export interface DropdownMenuLabelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const DropdownMenuLabel = ({
  className,
  children,
  ...props
}: DropdownMenuLabelProps) => (
  <div
    className={cn('px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-text-muted', className)}
    {...props}
  >
    {children}
  </div>
);

export const DropdownMenuSeparator = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mx-2 h-px bg-border-default/40', className)} {...props} />
);
