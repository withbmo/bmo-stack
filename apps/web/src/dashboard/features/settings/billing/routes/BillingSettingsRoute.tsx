'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import { SettingsLayout } from '../../shared/components/SettingsLayout';
import { BillingTab } from '../components/BillingTab';

export const BillingSettingsRoute = () => {
  return (
    <SettingsLayout>
      <Link
        href="/dashboard"
        className="absolute top-6 right-6 flex items-center gap-2 text-nexus-muted hover:text-white transition-colors font-mono text-xs uppercase tracking-wider"
      >
        <ChevronLeft size={16} /> BACK
      </Link>
      <BillingTab />
    </SettingsLayout>
  );
};
