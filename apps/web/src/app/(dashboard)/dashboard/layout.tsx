'use client';

import { DashboardLayout } from '@/dashboard/components/layout';
import { ProtectedDashboardGuard } from '@/dashboard/shared/guards/ProtectedDashboardGuard';

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedDashboardGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedDashboardGuard>
  );
}
