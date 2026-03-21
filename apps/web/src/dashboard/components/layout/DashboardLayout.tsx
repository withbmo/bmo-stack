import { MotionFade } from '@/ui';

import { Navbar } from './Navbar';

/**
 * Shell for /dashboard/*: fixed Navbar + main content area.
 * In Next.js, children are passed from the layout.
 */
export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-transparent text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(60%_100%_at_50%_0%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-[28rem] bg-[radial-gradient(70%_100%_at_50%_100%,color-mix(in_oklab,var(--accent)_10%,transparent),transparent)]" />
      </div>
      <Navbar />
      <MotionFade as="main" className="flex flex-1 flex-col pb-24">
        {children}
      </MotionFade>
    </div>
  );
};
