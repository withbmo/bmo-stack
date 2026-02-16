'use client';

import { Button } from '@pytholit/ui';
import { ChevronRight, Terminal } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode,useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/shared/auth';
import { NAV_ITEMS } from '@/site/data/navigation';

const AUTH_PATHS = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/verify-otp',
  '/auth/callback',
];

function SiteNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const isAuthPage = AUTH_PATHS.some(p => pathname === p);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 h-20 flex items-center transition-all duration-300 border-b px-6 py-5 md:px-8 ${
        scrolled
          ? 'bg-nexus-black/90 border-nexus-purple/30 backdrop-blur-md'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
        <Link
          href="/"
          className="fixed left-8 top-10 -translate-y-1/2 z-[60] flex items-center gap-3 group p-4"
        >
          <div className="w-8 h-8 bg-nexus-purple flex items-center justify-center border border-white group-hover:bg-nexus-neon transition-colors shrink-0">
            <Terminal size={18} className="text-white" />
          </div>
          <span className="font-mono font-bold text-xl tracking-tighter truncate">pytholit</span>
        </Link>

        <div className="w-[140px] shrink-0" aria-hidden />

        <div className="hidden md:flex gap-10">
          {NAV_ITEMS.map(item => {
            const isActive =
              pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`font-mono text-sm transition-colors tracking-widest relative group cursor-pointer ${
                  isActive ? 'text-nexus-purple' : 'text-nexus-light hover:text-nexus-purple'
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-nexus-purple transition-all ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {!isAuthPage && (
          <div className="hidden md:block">
            <Button variant="primary" size="md" to={isAuthenticated ? '/dashboard' : '/auth/login'}>
              {isAuthenticated ? 'GO TO DASHBOARD' : 'START BUILDING'} <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-nexus-gray bg-nexus-black px-6 py-10 text-xs font-mono text-nexus-muted">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="text-[10px] tracking-[0.25em] text-nexus-purple">PYTHOLIT</div>
          <div>© 2026 pytholit · ALL SYSTEMS OPERATIONAL</div>
          <div className="text-[11px] text-nexus-light/60">
            Build, ship, and observe runtime-native workloads without the boilerplate.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="text-[10px] font-semibold tracking-[0.2em] text-nexus-light/80">
              PRODUCT
            </div>
            <div className="flex flex-col gap-1.5">
              <a href="#platform" className="hover:text-nexus-purple">
                Platform
              </a>
              <a href="#workflow" className="hover:text-nexus-purple">
                Workflow
              </a>
              <a href="#pricing" className="hover:text-nexus-purple">
                Pricing
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-semibold tracking-[0.2em] text-nexus-light/80">
              COMPANY
            </div>
            <div className="flex flex-col gap-1.5">
              <a href="/about" className="hover:text-nexus-purple">
                About
              </a>
              <a href="/careers" className="hover:text-nexus-purple">
                Careers
              </a>
              <a href="/contact" className="hover:text-nexus-purple">
                Contact us
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-semibold tracking-[0.2em] text-nexus-light/80">
              RESOURCES
            </div>
            <div className="flex flex-col gap-1.5">
              <Link href="/docs" className="hover:text-nexus-purple">
                Docs
              </Link>
              <a href="/blog" className="hover:text-nexus-purple">
                Blog
              </a>
              <a href="/changelog" className="hover:text-nexus-purple">
                Changelog
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-semibold tracking-[0.2em] text-nexus-light/80">
              SOCIAL
            </div>
            <div className="flex flex-col gap-1.5">
              <a href="#" className="hover:text-nexus-purple">
                GitHub
              </a>
              <a href="#" className="hover:text-nexus-purple">
                Discord
              </a>
              <a href="#" className="hover:text-nexus-purple">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const hideChrome = useMemo(
    () => pathname.startsWith('/dashboard') || pathname.startsWith('/editor'),
    [pathname]
  );

  const isAuthPage = useMemo(() => AUTH_PATHS.some(p => pathname === p), [pathname]);
  const showFooter = !isAuthPage;

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-bg-app text-white selection:bg-nexus-purple selection:text-white font-sans flex flex-col relative overflow-hidden">
      <SiteNavbar />
      <main className="flex-grow relative z-20">{children}</main>
      {showFooter && <SiteFooter />}
    </div>
  );
}
