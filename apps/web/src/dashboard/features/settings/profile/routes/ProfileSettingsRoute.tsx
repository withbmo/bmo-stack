'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import { SettingsLayout } from '../../shared/components/SettingsLayout';
import { ProfileTab } from '../components/ProfileTab';

export const ProfileSettingsRoute = () => {
  return (
    <SettingsLayout>
      <Link
        href="/dashboard"
        className="absolute right-6 top-6 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-text-muted transition-colors hover:text-white"
      >
        <ChevronLeft size={16} /> BACK
      </Link>
      <ProfileTab />
    </SettingsLayout>
  );
};
