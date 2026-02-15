'use client';

import { AdminLayout } from '@/admin/components/layout';
import { ProtectedAdminGuard } from '@/admin/shared/guards/ProtectedAdminGuard';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedAdminGuard>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedAdminGuard>
  );
}

