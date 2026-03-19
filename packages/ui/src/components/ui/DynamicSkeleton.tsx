'use client';

import {
  createContext,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  useContext,
} from 'react';

import { cn } from '../../utils/cn';

type DynamicSkeletonContextValue = {
  loading: boolean;
};

const DynamicSkeletonContext = createContext<DynamicSkeletonContextValue>({
  loading: false,
});

export interface DynamicSkeletonProviderProps {
  loading: boolean;
  children: ReactNode;
}

export const DynamicSkeletonProvider = ({ loading, children }: DynamicSkeletonProviderProps) => {
  return (
    <DynamicSkeletonContext.Provider value={{ loading }}>
      {children}
    </DynamicSkeletonContext.Provider>
  );
};

export const useDynamicSkeletonLoading = (override?: boolean): boolean => {
  const context = useContext(DynamicSkeletonContext);
  return typeof override === 'boolean' ? override : context.loading;
};

function resolveTextWidth(children: ReactNode): CSSProperties | undefined {
  if (typeof children !== 'string' && typeof children !== 'number') return undefined;
  const text = String(children);
  const ch = Math.max(6, Math.min(28, text.length || 8));
  return { width: `${ch}ch` };
}

export interface DynamicValueProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  as?: ElementType;
  loading?: boolean;
  children: ReactNode;
  skeleton?: ReactNode;
  skeletonClassName?: string;
  skeletonStyle?: CSSProperties;
}

export const DynamicValue = ({
  as,
  loading,
  children,
  className,
  skeleton,
  skeletonClassName,
  skeletonStyle,
  ...rest
}: DynamicValueProps) => {
  const isLoading = useDynamicSkeletonLoading(loading);
  const Component = (as ?? 'span') as ElementType;

  if (isLoading) {
    if (skeleton) return <>{skeleton}</>;
    return (
      <span
        className={cn(
          'inline-block h-[1em] align-[-0.1em] animate-pulse bg-border-dim/20 border border-border-dim/40',
          skeletonClassName
        )}
        style={{ ...resolveTextWidth(children), ...skeletonStyle }}
        aria-hidden="true"
      />
    );
  }

  return (
    <Component className={className} {...rest}>
      {children}
    </Component>
  );
};

export interface DynamicSlotProps {
  loading?: boolean;
  children: ReactNode;
  skeleton: ReactNode;
}

export const DynamicSlot = ({ loading, children, skeleton }: DynamicSlotProps) => {
  const isLoading = useDynamicSkeletonLoading(loading);
  if (isLoading) return <>{skeleton}</>;
  return <>{children}</>;
};
