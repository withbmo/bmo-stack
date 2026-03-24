import { cn } from '@/ui';
import type { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export const PageLayout = ({ children, className = '' }: PageLayoutProps) => {
  return (
    <div className={cn('relative bg-transparent px-4 pb-20 pt-8 sm:px-6 lg:px-8', className)}>
      <div className="relative z-10 mx-auto w-full max-w-[1200px]">{children}</div>
    </div>
  );
};
