'use client';

import { createContext, type ReactNode, useContext } from 'react';

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
