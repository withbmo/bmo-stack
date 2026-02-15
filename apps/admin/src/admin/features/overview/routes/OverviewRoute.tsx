'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@pytholit/ui';
import { AdminPage } from '@/admin/shared/components/AdminPage';
import { useAuth } from '@/shared/auth';
import { apiRequest, API_V1 } from '@/shared/lib/client';

type OverviewStats = {
  users: { total: number; active: number };
  environments: { total: number };
  deployJobs: { total: number; failedLast24h: number };
};

async function fetchOverview(token: string): Promise<OverviewStats> {
  return apiRequest<OverviewStats>(`${API_V1}/admin/overview`, { method: 'GET', token });
}

export function OverviewRoute() {
  const { token } = useAuth();
  const q = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: () => fetchOverview(token || ''),
    enabled: !!token,
  });

  return (
    <AdminPage title="Overview" subtitle="System snapshot across all tenants">
      {q.isLoading ? (
        <div className="font-mono text-xs text-nexus-muted">Loading…</div>
      ) : q.isError ? (
        <div className="font-mono text-xs text-red-400">Failed to load.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-bg-panel border border-nexus-gray">
            <div className="font-mono text-[10px] tracking-wider text-nexus-muted uppercase">
              Users
            </div>
            <div className="mt-2 font-sans text-3xl">{q.data?.users.total ?? 0}</div>
            <div className="mt-1 font-mono text-xs text-nexus-muted">
              active: {q.data?.users.active ?? 0}
            </div>
          </Card>
          <Card className="p-4 bg-bg-panel border border-nexus-gray">
            <div className="font-mono text-[10px] tracking-wider text-nexus-muted uppercase">
              Environments
            </div>
            <div className="mt-2 font-sans text-3xl">{q.data?.environments.total ?? 0}</div>
          </Card>
          <Card className="p-4 bg-bg-panel border border-nexus-gray">
            <div className="font-mono text-[10px] tracking-wider text-nexus-muted uppercase">
              DeployJobs (24h failures)
            </div>
            <div className="mt-2 font-sans text-3xl">
              {q.data?.deployJobs.failedLast24h ?? 0}
            </div>
            <div className="mt-1 font-mono text-xs text-nexus-muted">
              total: {q.data?.deployJobs.total ?? 0}
            </div>
          </Card>
        </div>
      )}
    </AdminPage>
  );
}

