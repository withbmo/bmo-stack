'use client';

import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { createContext, useContext, useId, useMemo, useState } from 'react';

import { cn } from '../../utils/cn';

type TabsContextValue = {
  baseId: string;
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(`${component} must be used inside <Tabs>.`);
  }
  return context;
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}

export const Tabs = ({
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) => {
  const generatedId = useId();
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
  const activeValue = value ?? uncontrolledValue;

  const context = useMemo<TabsContextValue>(
    () => ({
      baseId: generatedId,
      value: activeValue,
      setValue: nextValue => {
        if (value === undefined) {
          setUncontrolledValue(nextValue);
        }
        onValueChange?.(nextValue);
      },
    }),
    [activeValue, generatedId, onValueChange, value]
  );

  return (
    <TabsContext.Provider value={context}>
      <div className={cn('flex flex-col gap-4', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const TabsList = ({ className, children, ...props }: TabsListProps) => {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex w-fit flex-wrap gap-2 border border-border-dim bg-bg-panel p-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = ({ className, value, children, ...props }: TabsTriggerProps) => {
  const context = useTabsContext('TabsTrigger');
  const isActive = context.value === value;
  const triggerId = `${context.baseId}-trigger-${value}`;
  const contentId = `${context.baseId}-content-${value}`;

  return (
    <button
      id={triggerId}
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={contentId}
      data-state={isActive ? 'active' : 'inactive'}
      tabIndex={isActive ? 0 : -1}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap border px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-app',
        isActive
          ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
          : 'border-transparent text-text-secondary hover:border-border-default hover:text-text-primary',
        className
      )}
      onClick={() => context.setValue(value)}
      {...props}
    >
      {children}
    </button>
  );
};
