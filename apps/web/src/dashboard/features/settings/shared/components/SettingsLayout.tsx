'use client';

import { Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useRef, useState } from 'react';

import { SETTINGS_TABS } from '@/shared/constants/settings';

interface SettingsLayoutProps {
  children: ReactNode;
}

/**
 * Fades + slides content on route change.
 * Works for every future settings page automatically — no per-page code needed.
 *
 * Strategy: track the previous key. When it changes:
 *   1. Immediately render new children (already mounted by Next.js).
 *   2. Play a CSS animation via an incrementing animationKey so React
 *      re-triggers the keyframe even if the class stays the same.
 */
function PageTransition({ routeKey, children }: { routeKey: string; children: ReactNode }) {
  const prevKeyRef = useRef(routeKey);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (routeKey !== prevKeyRef.current) {
      prevKeyRef.current = routeKey;
      setAnimKey(k => k + 1);
    }
  }, [routeKey]);

  return (
    <div
      key={animKey}
      style={{
        animation: 'settingsPageIn 220ms cubic-bezier(0.16, 1, 0.3, 1) both',
      }}
    >
      {children}
    </div>
  );
}

export const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  const pathname = usePathname();
  const basePath = '/dashboard/settings';

  return (
    <>
      {/* Keyframe injected once — no external CSS file needed */}
      <style>{`
        @keyframes settingsPageIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>

      <div className="flex-1 min-h-[calc(100vh-4rem)] overflow-hidden flex flex-col bg-bg-app">
        <aside className="w-full md:fixed md:left-0 md:top-16 md:w-64 md:h-[calc(100vh-4rem)] md:overflow-y-auto md:z-10 border-b md:border-b-0 md:border-r border-border-default bg-bg-panel p-6 flex flex-col shrink-0">
          <div className="mb-6 font-mono text-xs font-bold text-text-primary/85 tracking-widest uppercase flex items-center gap-2">
            <Settings size={14} /> Settings
          </div>
          <nav className="space-y-0.5">
            {SETTINGS_TABS.map(tab => {
              const href = `${basePath}/${tab.id}`;
              const isActive = pathname === href || (tab.id === 'profile' && pathname === basePath);
              return (
                <Link
                  key={tab.id}
                  href={href}
                  className={`w-full text-left px-3 py-2.5 font-mono text-xs uppercase tracking-wider transition-all border-l-2 flex items-center gap-3 ${
                    isActive
                      ? 'border-border-highlight text-text-primary bg-bg-surface'
                      : 'border-transparent text-text-primary/75 hover:text-text-primary hover:bg-bg-surface'
                  }`}
                >
                  <tab.icon size={13} />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 min-h-0 p-8 overflow-y-auto bg-bg-app relative md:ml-64">
          <div className="max-w-3xl mx-auto">
            <PageTransition routeKey={pathname ?? ''}>{children}</PageTransition>
          </div>
        </div>
      </div>
    </>
  );
};
