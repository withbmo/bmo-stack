'use client';

import { Check, ChevronDown } from 'lucide-react';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { createContext, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';

import { Presence } from '../../motion';
import { cn } from '../../utils/cn';

type SelectContextValue = {
  contentId: string;
  value: string;
  setValue: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext(component: string) {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error(`${component} must be used within <Select>.`);
  }
  return context;
}

export interface SelectProps {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Select = ({
  children,
  value,
  defaultValue = '',
  onValueChange,
  open,
  defaultOpen = false,
  onOpenChange,
}: SelectProps) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const contentId = useId();
  const selectedValue = value ?? uncontrolledValue;
  const isOpen = open ?? uncontrolledOpen;

  const context = useMemo<SelectContextValue>(
    () => ({
      contentId,
      value: selectedValue,
      setValue: nextValue => {
        if (value === undefined) {
          setUncontrolledValue(nextValue);
        }
        onValueChange?.(nextValue);
      },
      open: isOpen,
      setOpen: nextOpen => {
        if (open === undefined) {
          setUncontrolledOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
      },
    }),
    [contentId, isOpen, onOpenChange, onValueChange, open, selectedValue, value]
  );

  return <SelectContext.Provider value={context}>{children}</SelectContext.Provider>;
};

export interface SelectTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
}

export const SelectTrigger = ({ className, children, ...props }: SelectTriggerProps) => {
  const context = useSelectContext('SelectTrigger');

  return (
    <button
      type="button"
      aria-haspopup="listbox"
      aria-expanded={context.open}
      aria-controls={context.contentId}
      className={cn(
        'inline-flex w-full items-center justify-between gap-3 border border-border-default bg-bg-panel px-3 py-3 font-mono text-sm text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-app',
        className
      )}
      onClick={() => context.setOpen(!context.open)}
      {...props}
    >
      <span className="truncate text-left">{children}</span>
      <ChevronDown size={16} className="shrink-0 text-text-secondary" />
    </button>
  );
};

export interface SelectContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const SelectContent = ({ className, children, ...props }: SelectContentProps) => {
  const context = useSelectContext('SelectContent');
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
          role="listbox"
          className={cn(
            'absolute top-[calc(100%+0.5rem)] z-[var(--z-overlay)] w-full border border-border-default bg-bg-panel shadow-[var(--shadow-panel)]',
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

export interface SelectItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: ReactNode;
}

export const SelectItem = ({ value, className, children, ...props }: SelectItemProps) => {
  const context = useSelectContext('SelectItem');
  const isSelected = context.value === value;

  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      className={cn(
        'flex w-full items-center gap-2 px-3 py-2 text-left font-mono text-sm transition-colors',
        isSelected
          ? 'bg-brand-primary/10 text-brand-primary'
          : 'text-text-secondary hover:bg-border-default/10 hover:text-text-primary',
        className
      )}
      onClick={() => {
        context.setValue(value);
        context.setOpen(false);
      }}
      {...props}
    >
      <span className="flex-1">{children}</span>
      {isSelected ? <Check size={14} className="shrink-0" /> : null}
    </button>
  );
};

export const SelectValue = ({
  placeholder,
  options,
}: {
  placeholder: string;
  options: Array<{ value: string; label: string }>;
}) => {
  const context = useSelectContext('SelectValue');
  const current = options.find(option => option.value === context.value);

  return (
    <span className={cn(!current && 'text-text-muted')}>
      {current?.label ?? placeholder}
    </span>
  );
};
