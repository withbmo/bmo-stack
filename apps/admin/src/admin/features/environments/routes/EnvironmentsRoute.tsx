'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Input, Button } from '@pytholit/ui';
import { AdminPage } from '@/admin/shared/components/AdminPage';
import { useAuth } from '@/shared/auth';
import { adminListEnvironments } from '@/shared/lib/admin';

export function EnvironmentsRoute() {
  const { token } = useAuth();
  const [q, setQ] = useState('');
  const [pendingQ, setPendingQ] = useState('');

  const queryKey = useMemo(() => ['admin', 'environments', { q }], [q]);
  const envQ = useQuery({
    queryKey,
    queryFn: () => adminListEnvironments(token || '', { q, page: 1, pageSize: 50 }),
    enabled: !!token,
  });

  return (
    <AdminPage
      title="Environments"
      subtitle="Cross-user environment inventory"
      right={
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setQ(pendingQ.trim());
          }}
          className="flex gap-2"
        >
          <Input
            placeholder="Search name/owner/project…"
            value={pendingQ}
            onChange={(e) => setPendingQ(e.target.value)}
            className="w-[260px]"
          />
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
      }
    >
      <Card className="p-0 overflow-hidden bg-bg-panel border border-nexus-gray">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-nexus-black border-b border-nexus-gray">
              <tr className="font-mono text-[10px] tracking-wider uppercase text-nexus-muted">
                <th className="p-3">Display</th>
                <th className="p-3">Name</th>
                <th className="p-3">Owner</th>
                <th className="p-3">Tier</th>
                <th className="p-3">Mode</th>
                <th className="p-3">Region</th>
              </tr>
            </thead>
            <tbody>
              {envQ.isLoading ? (
                <tr>
                  <td className="p-3 font-mono text-xs text-nexus-muted" colSpan={6}>
                    Loading…
                  </td>
                </tr>
              ) : envQ.isError ? (
                <tr>
                  <td className="p-3 font-mono text-xs text-red-400" colSpan={6}>
                    Failed to load.
                  </td>
                </tr>
              ) : (envQ.data?.items || []).length === 0 ? (
                <tr>
                  <td className="p-3 font-mono text-xs text-nexus-muted" colSpan={6}>
                    No environments.
                  </td>
                </tr>
              ) : (
                envQ.data!.items.map((e) => (
                  <tr key={e.id} className="border-b border-nexus-gray/60">
                    <td className="p-3 font-mono text-xs">{e.displayName}</td>
                    <td className="p-3 font-mono text-xs text-nexus-muted">{e.name}</td>
                    <td className="p-3 font-mono text-xs text-nexus-muted">{e.ownerId}</td>
                    <td className="p-3 font-mono text-xs">{e.tierPolicy}</td>
                    <td className="p-3 font-mono text-xs">{e.executionMode}</td>
                    <td className="p-3 font-mono text-xs">{e.region}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminPage>
  );
}

