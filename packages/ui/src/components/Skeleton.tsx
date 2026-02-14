import { cn } from '../utils/cn';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div className={cn('animate-pulse bg-border-dim/20 border border-border-dim/40', className)} />
  );
};

Skeleton.displayName = 'Skeleton';
