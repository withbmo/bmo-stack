'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/shared/auth';
import { SETTINGS_TABS } from '@/shared/constants/settings';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const basePath = '/dashboard/settings';

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] overflow-hidden flex flex-col bg-nexus-black">
      <aside className="w-full md:fixed md:left-0 md:top-16 md:w-64 md:h-[calc(100vh-4rem)] md:overflow-y-auto md:z-10 border-b md:border-b-0 md:border-r border-nexus-gray bg-nexus-dark p-6 flex flex-col shrink-0">
        <div className="mb-8 font-mono text-xs font-bold text-nexus-purple tracking-widest uppercase flex items-center gap-2">
          <Settings size={14} /> SYSTEM CONFIG
        </div>
        <nav className="space-y-1">
          {SETTINGS_TABS.map(tab => {
            const href = `${basePath}/${tab.id}`;
            const isActive = pathname === href || (tab.id === 'profile' && pathname === basePath);
            return (
              <Link
                key={tab.id}
                href={href}
                className={`w-full text-left px-4 py-3 font-mono text-xs uppercase tracking-wider transition-all border-l-2 flex items-center gap-3 ${
                  isActive
                    ? 'border-nexus-purple text-white bg-nexus-purple/10'
                    : 'border-transparent text-nexus-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 mt-6 border-t border-nexus-gray">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 font-mono text-xs uppercase tracking-wider text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-h-0 p-8 overflow-y-auto bg-nexus-dark relative md:ml-64">
        <div className="max-w-5xl mx-auto">{children}</div>
      </div>
    </div>
  );
};
