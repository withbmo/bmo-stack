'use client';

import { LogOut, Terminal, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { NovuInbox } from '@/dashboard/components/notifications/NovuInbox';
import { useAuth } from '@/shared/auth';
import { resolveAvatarUrl } from '@/shared/lib/avatar';
import type { User as CurrentUser } from '@/shared/lib/user';

const DASH_LINKS = [
  { to: '/dashboard', label: 'PROJECTS' },
  { to: '/dashboard/hub', label: 'HUB' },
  { to: '/dashboard/templates', label: 'TEMPLATES' },
  { to: '/dashboard/deployments', label: 'DEPLOYMENTS' },
] as const;

/** App shell navbar for /dashboard/*: projects/hub/templates/deployments, notifications, user menu */
export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, hydrated } = useAuth();
  const [profile, setProfile] = useState<CurrentUser | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    setProfile(user);
  }, [hydrated, user]);

  const avatarUrl = useMemo(() => resolveAvatarUrl(profile?.avatarUrl), [profile?.avatarUrl]);

  const navLinkClass = (path: string) =>
    pathname === path
      ? 'text-text-primary bg-bg-surface'
      : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface/60';

  return (
    <nav className="fixed left-0 top-0 z-50 flex h-16 w-full items-center border-b border-border-default bg-bg-panel shadow-lg shadow-black/20">
      <div className="flex w-full items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="flex h-6 w-6 items-center justify-center border border-brand-primary/60 bg-brand-primary transition-colors group-hover:bg-brand-neon">
              <Terminal size={14} className="text-white" />
            </div>
            <span className="font-mono text-lg font-bold tracking-tighter text-text-primary">
              pytholit
            </span>
          </Link>

          <div className="hidden md:flex gap-1 border-l border-border-default pl-6 h-8 items-center">
            {DASH_LINKS.map(({ to, label }) => (
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

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 relative">
            <NovuInbox />

            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 cursor-pointer group border-l border-transparent pl-3 hover:border-border-default transition-colors"
            >
              <div className="hidden text-right leading-tight md:block">
                <div className="font-mono text-xs text-text-primary group-hover:text-brand-primary transition-colors">
                  {profile?.username || 'USER'}
                </div>
              </div>
              <div className="w-8 h-8 bg-bg-surface border border-border-default flex items-center justify-center text-text-primary group-hover:border-brand-primary group-hover:text-white group-hover:bg-brand-primary transition-all overflow-hidden">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <User size={14} />
                )}
              </div>
            </Link>
            <button
              onClick={async () => {
                await logout();
                router.push('/auth/login');
              }}
              className="text-text-secondary hover:text-red-400 transition-colors ml-2"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
