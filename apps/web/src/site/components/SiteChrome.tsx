'use client';

import { MotionFade, MotionSlideIn } from '@pytholit/ui/ui';
import { Button } from '@pytholit/ui/ui';
import { ChevronRight, Terminal } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/shared/auth';
import { NAV_ITEMS } from '@/site/data/navigation';

const AUTH_PATHS = ['/auth/login', '/auth/signup', '/auth/callback'];

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
    <MotionFade
      as="nav"
      className={`fixed left-0 top-0 z-50 flex h-20 w-full items-center border-b px-6 py-5 transition-all duration-300 md:px-8 ${
        scrolled
          ? 'border-brand-primary/30 bg-bg-app/90 backdrop-blur-md'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <MotionSlideIn
          as="div"
          delay={0.06}
          className="fixed left-8 top-10 z-[60] -translate-y-1/2"
        >
          <Link href="/" className="flex items-center gap-3 group p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-text-primary bg-brand-primary transition-colors group-hover:bg-brand-neon">
              <Terminal size={18} className="text-white" />
            </div>
            <span className="font-mono font-bold text-xl tracking-tighter truncate">pytholit</span>
          </Link>
        </MotionSlideIn>

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
                  isActive ? 'text-brand-primary' : 'text-text-secondary hover:text-brand-primary'
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-brand-primary transition-all ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {!isAuthPage && (
          <div className="hidden md:block">
            <Button variant="primary" size="md" asChild>
              <Link href={isAuthenticated ? '/dashboard' : '/auth/login'}>
                {isAuthenticated ? 'GO TO DASHBOARD' : 'START BUILDING'} <ChevronRight size={16} />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </MotionFade>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border-default bg-bg-app px-6 py-10 font-mono text-xs text-text-muted">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="text-[10px] tracking-[0.25em] text-brand-primary">PYTHOLIT</div>
          <div>© 2026 pytholit · ALL SYSTEMS OPERATIONAL</div>
          <div className="text-[11px] text-text-secondary/60">
            Build, ship, and observe runtime-native workloads without the boilerplate.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="text-[10px] font-semibold tracking-[0.2em] text-text-secondary/80">
              PRODUCT
            </div>
            <div className="flex flex-col gap-1.5">
              <a href="#platform" className="hover:text-brand-primary">
                Platform
              </a>
              <a href="#workflow" className="hover:text-brand-primary">
                Workflow
              </a>
              <a href="#pricing" className="hover:text-brand-primary">
                Pricing
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-semibold tracking-[0.2em] text-text-secondary/80">
              COMPANY
            </div>
            <div className="flex flex-col gap-1.5">
              <a href="/about" className="hover:text-brand-primary">
                About
              </a>
              <a href="/careers" className="hover:text-brand-primary">
                Careers
              </a>
              <a href="/contact" className="hover:text-brand-primary">
                Contact us
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-semibold tracking-[0.2em] text-text-secondary/80">
              RESOURCES
            </div>
            <div className="flex flex-col gap-1.5">
              <Link href="/docs" className="hover:text-brand-primary">
                Docs
              </Link>
              <a href="/blog" className="hover:text-brand-primary">
                Blog
              </a>
              <a href="/changelog" className="hover:text-brand-primary">
                Changelog
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-semibold tracking-[0.2em] text-text-secondary/80">
              SOCIAL
            </div>
            <div className="flex flex-col gap-1.5">
              <a href="#" className="hover:text-brand-primary">
                GitHub
              </a>
              <a href="#" className="hover:text-brand-primary">
                Discord
              </a>
              <a href="#" className="hover:text-brand-primary">
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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-bg-app font-sans text-white selection:bg-brand-primary selection:text-white">
      <SiteNavbar />
      <main className="flex-grow relative z-20">{children}</main>
      {showFooter && <SiteFooter />}
    </div>
  );
}
