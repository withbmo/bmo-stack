import { cn, MotionScaleIn } from '@pytholit/ui/ui';
import { BackgroundLayers } from '@pytholit/ui/blocks';
import type { CSSProperties, ReactNode } from 'react';

interface AuthPageLayoutProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  contentStyle?: CSSProperties;
}

export const AuthPageLayout = ({
  children,
  className = '',
  contentClassName = '',
  contentStyle,
}: AuthPageLayoutProps) => (
  <div
    className={cn(
      'relative flex min-h-screen items-center justify-center bg-bg-app px-6 py-20',
      className
    )}
  >
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <BackgroundLayers />
    </div>

    <MotionScaleIn
      className={cn('relative z-10 w-full max-w-md', contentClassName)}
      style={contentStyle}
    >
      {children}
    </MotionScaleIn>
  </div>
);
