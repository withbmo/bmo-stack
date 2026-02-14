'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Terminal, LogOut, User } from 'lucide-react';
import { useAuth } from '@/shared/auth';
import { useEffect, useMemo, useState } from 'react';
import { getCurrentUser, type UserProfile } from '@/shared/lib/user';
import { resolveAvatarUrl } from '@/shared/lib/avatar';
import { getSubscription, getPlans } from '@/shared/lib/billing';
import { NovuInbox } from '@/dashboard/components/notifications/NovuInbox';

const DASH_LINKS = [
  { to: '/dashboard', label: 'PROJECTS' },
  { to: '/dashboard/hub', label: 'HUB' },
  { to: '/dashboard/templates', label: 'TEMPLATES' },
  { to: '/dashboard/deployments', label: 'DEPLOYMENTS' },
  { to: '/dashboard/environments', label: 'ENVIRONMENTS' },
] as const;

/** App shell navbar for /dashboard/*: projects/hub/templates/deployments, notifications, user menu */
export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [planLabel, setPlanLabel] = useState<string>('FREE TIER');

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await getCurrentUser(token);
        if (!cancelled) setProfile(data);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const [sub, plans] = await Promise.all([getSubscription(token), getPlans()]);
        if (cancelled) return;
        const active = sub?.planId ? plans.find(p => p.id === sub.planId) : plans[0] || null;
        setPlanLabel((active?.name || 'FREE TIER').toUpperCase().replace(/_/g, ' '));
      } catch {
        if (!cancelled) setPlanLabel('FREE TIER');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const avatarUrl = useMemo(() => resolveAvatarUrl(profile?.avatarUrl), [profile?.avatarUrl]);

  const navLinkClass = (path: string) =>
    pathname === path
      ? 'text-white bg-nexus-gray/30'
      : 'text-nexus-muted hover:text-nexus-purple hover:bg-nexus-gray/10';

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-nexus-black border-b border-nexus-gray h-16 flex items-center shadow-lg shadow-purple-900/5">
      <div className="w-full px-6 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-6 h-6 bg-nexus-purple flex items-center justify-center border border-white group-hover:bg-nexus-neon transition-colors">
              <Terminal size={14} className="text-white" />
            </div>
            <span className="font-mono font-bold text-lg tracking-tighter">pytholit</span>
          </Link>

          <div className="hidden md:flex gap-1 border-l border-nexus-gray pl-6 h-8 items-center">
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
            <button className="px-3 py-1 font-mono text-xs font-bold transition-colors tracking-wider rounded-sm text-nexus-muted hover:text-nexus-purple hover:bg-nexus-gray/10">
              LOGS
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-nexus-accent bg-nexus-accent/5 px-3 py-1.5 border border-nexus-accent/20">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexus-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-nexus-accent"></span>
            </div>
            SYSTEM_ONLINE
          </div>

          <div className="h-6 w-[1px] bg-nexus-gray hidden md:block"></div>

          <div className="flex items-center gap-3 relative">
            <NovuInbox token={token} />

            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 cursor-pointer group border-l border-transparent pl-3 hover:border-nexus-gray transition-colors"
            >
              <div className="text-right hidden md:block leading-tight">
                <div className="font-mono text-xs text-white group-hover:text-nexus-purple transition-colors">
                  {(profile?.username || 'USER').replace(/_/g, ' ')}
                </div>
                <div className="font-mono text-[10px] text-nexus-muted">{planLabel}</div>
              </div>
              <div className="w-8 h-8 bg-nexus-gray/10 border border-nexus-gray flex items-center justify-center text-nexus-light group-hover:border-nexus-purple group-hover:text-white group-hover:bg-nexus-purple transition-all overflow-hidden">
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
        </div>
      </div>
    </nav>
  );
};
