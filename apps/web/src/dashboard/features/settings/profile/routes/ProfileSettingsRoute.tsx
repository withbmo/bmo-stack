'use client';

import { User } from 'lucide-react';
import { DashboardPageHeader } from '@/dashboard/components/layout';

import { SettingsLayout } from '../../shared/components/SettingsLayout';
import { ProfileTab } from '../components/ProfileTab';

export const ProfileSettingsRoute = () => {
  return (
    <SettingsLayout
      header={
        <DashboardPageHeader
          badge={{ icon: User, label: 'Profile' }}
          title="Profile settings"
          subtitle="Manage your public identity."
        />
      }
    >
      <ProfileTab hideHeader />
    </SettingsLayout>
  );
};
