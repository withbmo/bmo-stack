'use client';

import { MotionFade, MotionSlideIn } from '@/ui';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useMemo } from 'react';

import { useAuth } from '@/shared/auth';
import { Button } from '@/ui/shadcn/ui/button';
import { SiteFooter } from '@/site/components/chrome/SiteFooter';
import { NAV_ITEMS } from '@/site/data/navigation';

const AUTH_PATHS = ['/auth/login', '/auth/signup', '/auth/callback'];

function SiteNavbar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const isAuthPage = AUTH_PATHS.some(p => pathname === p);

  return (
    <MotionFade
      as="nav"
      className="fixed left-0 top-0 z-50 flex h-20 w-full items-center border-b border-border bg-background/95 px-6 py-5 backdrop-blur-md transition-all duration-300 md:px-8"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <MotionSlideIn
          as="div"
          delay={0.06}
          className="fixed left-8 top-10 z-[60] -translate-y-1/2"
        >
          <Link href="/" className="flex items-center gap-3 group p-4">
            <div className="h-6 w-[40px] shrink-0 overflow-hidden rounded-md border bg-background transition-opacity group-hover:opacity-90">
              <Image
                src="/brand-logo.png"
                alt="Pytholit logo"
                width={278}
                height={171}
                className="h-full w-full object-contain"
              />
            </div>
            <span className="truncate text-xl font-semibold tracking-tight">pytholit</span>
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
                className={`group relative cursor-pointer text-sm transition-colors ${
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {!isAuthPage && (
          <div className="hidden md:block">
            <Button asChild>
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

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith('/auth/');

  const hideChrome = useMemo(
    () => pathname.startsWith('/dashboard') || pathname.startsWith('/editor'),
    [pathname]
  );

  const isAuthPage = useMemo(
    () => AUTH_PATHS.some(p => pathname === p) || isAuthRoute,
    [pathname, isAuthRoute]
  );
  const showFooter = !isAuthPage;

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-transparent text-foreground selection:bg-primary selection:text-primary-foreground">
      <SiteNavbar />
      <main className="relative z-20 flex-grow pt-20">{children}</main>
      {showFooter && <SiteFooter />}
    </div>
  );
}
