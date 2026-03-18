import { BackgroundLayers, cn, MotionScaleIn } from '@pytholit/ui';
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
      'min-h-screen bg-nexus-black flex items-center justify-center relative px-6 py-20',
      className
    )}
  >
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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
