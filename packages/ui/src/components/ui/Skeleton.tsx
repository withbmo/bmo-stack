import type { CSSProperties } from 'react';

import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

export const Skeleton = ({ className, style }: SkeletonProps) => {
  return (
    <div
      className={cn('animate-pulse bg-border-dim/20 border border-border-dim/40', className)}
      style={style}
    />
  );
};

Skeleton.displayName = 'Skeleton';
