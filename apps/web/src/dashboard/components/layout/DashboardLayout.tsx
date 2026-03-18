import { MotionFade } from '@pytholit/ui';

import { Navbar } from './Navbar';

/**
 * Shell for /dashboard/*: fixed Navbar + main content area.
 * In Next.js, children are passed from the layout.
 */
export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-bg-dashboard text-white font-sans flex flex-col">
      <Navbar />
      <MotionFade as="main" className="flex-grow min-h-[calc(100vh-4rem)] flex flex-col pt-16">
        {children}
      </MotionFade>
    </div>
  );
};
