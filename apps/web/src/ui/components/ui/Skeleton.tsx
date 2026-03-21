import type { CSSProperties } from 'react';

import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

export const Skeleton = ({ className, style }: SkeletonProps) => {
  return (
    <div
      className={cn(
        'animate-pulse border border-border-dim/40 bg-border-dim/20',
        className
      )}
      aria-hidden="true"
      style={style}
    />
  );
};

Skeleton.displayName = 'Skeleton';
