'use client';

import { Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';

import { SETTINGS_TABS } from '@/shared/constants/settings';
import { PageLayout } from '@/dashboard/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/shadcn/ui/card';
import { cn } from '@/ui/lib/utils';

interface SettingsLayoutProps {
  header?: ReactNode;
  children: ReactNode;
}

export const SettingsLayout = ({ header, children }: SettingsLayoutProps) => {
  const pathname = usePathname();
  const basePath = '/dashboard/settings';

  return (
    <PageLayout className="pb-12">
      {header ? <div className="mb-6">{header}</div> : null}
      <div className="mx-auto grid w-full max-w-[1200px] gap-6 md:grid-cols-[260px_minmax(0,1fr)]">
        <Card className="h-fit md:self-start md:sticky md:top-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings size={16} />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {SETTINGS_TABS.map(tab => {
              const href = `${basePath}/${tab.id}`;
              const isActive = pathname === href || (tab.id === 'profile' && pathname === basePath);
              return (
                <Link
                  key={tab.id}
                  href={href}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                  )}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <div className="min-w-0 space-y-6">{children}</div>
      </div>
    </PageLayout>
  );
};
