'use client';

import { ChevronDown } from 'lucide-react';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

import { cn } from '../../utils/cn';

type AccordionContextValue = {
  value: string | null;
  setValue: (value: string) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext(component: string) {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error(`${component} must be used within <Accordion>.`);
  }
  return context;
}

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  children: ReactNode;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  collapsible?: boolean;
}

export const Accordion = ({
  children,
  value,
  defaultValue = null,
  onValueChange,
  collapsible = true,
  className,
  ...props
}: AccordionProps) => {
  const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(defaultValue);
  const activeValue = value ?? uncontrolledValue;

  const context = useMemo<AccordionContextValue>(
    () => ({
      value: activeValue,
      setValue: nextValue => {
        const resolvedValue = collapsible && activeValue === nextValue ? null : nextValue;
        if (value === undefined) {
          setUncontrolledValue(resolvedValue);
        }
        onValueChange?.(resolvedValue);
      },
    }),
    [activeValue, collapsible, onValueChange, value]
  );

  return (
    <AccordionContext.Provider value={context}>
      <div className={cn('space-y-3', className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
}

export const AccordionItem = ({ value, className, children, ...props }: AccordionItemProps) => {
  const context = useAccordionContext('AccordionItem');
  const isOpen = context.value === value;

  return (
    <div
      data-state={isOpen ? 'open' : 'closed'}
      className={cn('border border-border-default bg-bg-panel', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export interface AccordionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: ReactNode;
}

export const AccordionTrigger = ({
  value,
  className,
  children,
  ...props
}: AccordionTriggerProps) => {
  const context = useAccordionContext('AccordionTrigger');
  const isOpen = context.value === value;

  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center justify-between gap-3 px-4 py-3 text-left font-mono text-xs uppercase tracking-wider text-text-primary transition-colors hover:bg-border-default/10',
        className
      )}
      aria-expanded={isOpen}
      onClick={() => context.setValue(value)}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        size={14}
        className={cn('shrink-0 text-text-secondary transition-transform', isOpen && 'rotate-180')}
      />
    </button>
  );
};

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
}

export const AccordionContent = ({
  value,
  className,
  children,
  ...props
}: AccordionContentProps) => {
  const context = useAccordionContext('AccordionContent');

  if (context.value !== value) {
    return null;
  }

  return (
    <div className={cn('border-t border-border-default px-4 py-4 text-sm text-text-secondary', className)} {...props}>
      {children}
    </div>
  );
};
