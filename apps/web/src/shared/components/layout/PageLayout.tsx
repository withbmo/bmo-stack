import { BackgroundLayers, cn, PageTransition } from '@pytholit/ui';
import type { ReactNode } from 'react';

export interface PageLayoutProps {
  children: ReactNode;
  /** Extra spacing/layout (e.g. pt-20 for auth, or no extra) */
  className?: string;
}

export const PageLayout = ({ children, className = '' }: PageLayoutProps) => {
  return (
    <div className={cn('min-h-screen bg-transparent pt-24 pb-20 px-6 relative', className)}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <BackgroundLayers />
      </div>
      <PageTransition className="max-w-7xl mx-auto relative z-10">{children}</PageTransition>
    </div>
  );
};
