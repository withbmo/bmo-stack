'use client';

import { IDERoute } from '@/dashboard/features/ide';
import { ProtectedDashboardGuard } from '@/dashboard/shared/guards/ProtectedDashboardGuard';

export default function EditorPage() {
  return (
    <ProtectedDashboardGuard>
      <IDERoute />
    </ProtectedDashboardGuard>
  );
}
