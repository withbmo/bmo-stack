'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, LogOut } from 'lucide-react';
import { useAuth } from '@/shared/auth';

const ADMIN_LINKS = [
  { to: '/admin', label: 'OVERVIEW' },
  { to: '/admin/users', label: 'USERS' },
  { to: '/admin/environments', label: 'ENVIRONMENTS' },
  { to: '/admin/deploy-jobs', label: 'DEPLOYJOBS' },
  { to: '/admin/billing', label: 'BILLING' },
] as const;

export const AdminNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const navLinkClass = (path: string) =>
    pathname === path
      ? 'text-white bg-nexus-gray/30'
      : 'text-nexus-muted hover:text-nexus-purple hover:bg-nexus-gray/10';

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-nexus-black border-b border-nexus-gray h-16 flex items-center shadow-lg shadow-purple-900/5">
      <div className="w-full px-6 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="flex items-center gap-2 group">
            <div className="w-6 h-6 bg-nexus-purple flex items-center justify-center border border-white group-hover:bg-nexus-neon transition-colors">
              <Shield size={14} className="text-white" />
            </div>
            <span className="font-mono font-bold text-lg tracking-tighter">
              pytholit<span className="text-nexus-muted">/admin</span>
            </span>
          </Link>

          <div className="hidden md:flex gap-1 border-l border-nexus-gray pl-6 h-8 items-center">
            {ADMIN_LINKS.map(({ to, label }) => (
              <Link key={to} href={to}>
                <button
                  className={`px-3 py-1 font-mono text-xs font-bold transition-colors tracking-wider rounded-sm ${navLinkClass(
                    to
                  )}`}
                >
                  {label}
                </button>
              </Link>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            router.push('/auth/login');
          }}
          className="text-nexus-muted hover:text-red-500 transition-colors ml-2"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
};

