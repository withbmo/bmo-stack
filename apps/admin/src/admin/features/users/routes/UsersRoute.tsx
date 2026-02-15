'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button, Card, Input } from '@pytholit/ui';
import { AdminPage } from '@/admin/shared/components/AdminPage';
import { useAuth } from '@/shared/auth';
import { getApiErrorMessage } from '@/shared/lib/client';
import { adminListUsers, adminUpdateUser } from '@/shared/lib/admin';

export function UsersRoute() {
  const { token } = useAuth();
  const qc = useQueryClient();
  const [q, setQ] = useState('');
  const [pendingQ, setPendingQ] = useState('');

  const queryKey = useMemo(() => ['admin', 'users', { q }], [q]);
  const usersQ = useQuery({
    queryKey,
    queryFn: () => adminListUsers(token || '', { q, page: 1, pageSize: 50 }),
    enabled: !!token,
  });

  const updateM = useMutation({
    mutationFn: (args: { userId: string; body: { isActive?: boolean; role?: string | null } }) =>
      adminUpdateUser(token || '', args.userId, args.body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('Updated.');
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Update failed')),
  });

  return (
    <AdminPage
      title="Users"
      subtitle="Search users, manage roles/permissions, and deactivate accounts"
      right={
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setQ(pendingQ.trim());
          }}
          className="flex gap-2"
        >
          <Input
            placeholder="Search email/username…"
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
                <th className="p-3">Email</th>
                <th className="p-3">Username</th>
                <th className="p-3">Role</th>
                <th className="p-3">Active</th>
                <th className="p-3 w-[220px]" />
              </tr>
            </thead>
            <tbody>
              {usersQ.isLoading ? (
                <tr>
                  <td className="p-3 font-mono text-xs text-nexus-muted" colSpan={5}>
                    Loading…
                  </td>
                </tr>
              ) : usersQ.isError ? (
                <tr>
                  <td className="p-3 font-mono text-xs text-red-400" colSpan={5}>
                    Failed to load.
                  </td>
                </tr>
              ) : (usersQ.data?.items || []).length === 0 ? (
                <tr>
                  <td className="p-3 font-mono text-xs text-nexus-muted" colSpan={5}>
                    No users.
                  </td>
                </tr>
              ) : (
                usersQ.data!.items.map((u) => (
                  <tr key={u.id} className="border-b border-nexus-gray/60">
                    <td className="p-3 font-mono text-xs">{u.email}</td>
                    <td className="p-3 font-mono text-xs text-nexus-muted">{u.username}</td>
                    <td className="p-3 font-mono text-xs">{u.role || 'user'}</td>
                    <td className="p-3 font-mono text-xs">{u.isActive ? 'yes' : 'no'}</td>
                    <td className="p-3 flex gap-2 justify-end">
                      <Button
                        variant="secondary"
                        onClick={() =>
                          updateM.mutate({
                            userId: u.id,
                            body: { isActive: !u.isActive },
                          })
                        }
                        disabled={updateM.isPending}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() =>
                          updateM.mutate({
                            userId: u.id,
                            body: { role: u.role === 'admin' ? 'user' : 'admin' },
                          })
                        }
                        disabled={updateM.isPending}
                      >
                        Toggle Role
                      </Button>
                    </td>
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

