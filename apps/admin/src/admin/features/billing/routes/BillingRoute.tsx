'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@pytholit/ui';
import { AdminPage } from '@/admin/shared/components/AdminPage';
import { useAuth } from '@/shared/auth';
import { adminListInvoices, adminListSubscriptions } from '@/shared/lib/admin';

export function BillingRoute() {
  const { token } = useAuth();
  const subsQ = useQuery({
    queryKey: ['admin', 'billing', 'subscriptions'],
    queryFn: () => adminListSubscriptions(token || '', { page: 1, pageSize: 25 }),
    enabled: !!token,
  });
  const invQ = useQuery({
    queryKey: ['admin', 'billing', 'invoices'],
    queryFn: () => adminListInvoices(token || '', { page: 1, pageSize: 25 }),
    enabled: !!token,
  });

  return (
    <AdminPage title="Billing" subtitle="Read-only subscription & invoice listings">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-0 overflow-hidden bg-bg-panel border border-nexus-gray">
          <div className="p-4 border-b border-nexus-gray bg-nexus-black">
            <div className="font-mono text-[10px] tracking-wider uppercase text-nexus-muted">
              Subscriptions
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-nexus-gray">
                <tr className="font-mono text-[10px] tracking-wider uppercase text-nexus-muted">
                  <th className="p-3">User</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Stripe</th>
                </tr>
              </thead>
              <tbody>
                {subsQ.isLoading ? (
                  <tr>
                    <td className="p-3 font-mono text-xs text-nexus-muted" colSpan={3}>
                      Loading…
                    </td>
                  </tr>
                ) : subsQ.isError ? (
                  <tr>
                    <td className="p-3 font-mono text-xs text-red-400" colSpan={3}>
                      Failed to load.
                    </td>
                  </tr>
                ) : (subsQ.data?.items || []).length === 0 ? (
                  <tr>
                    <td className="p-3 font-mono text-xs text-nexus-muted" colSpan={3}>
                      No subscriptions.
                    </td>
                  </tr>
                ) : (
                  subsQ.data!.items.map((s) => (
                    <tr key={s.id} className="border-b border-nexus-gray/60">
                      <td className="p-3 font-mono text-xs text-nexus-muted">{s.userId}</td>
                      <td className="p-3 font-mono text-xs">{s.status}</td>
                      <td className="p-3 font-mono text-xs">{s.externalSubscriptionId}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden bg-bg-panel border border-nexus-gray">
          <div className="p-4 border-b border-nexus-gray bg-nexus-black">
            <div className="font-mono text-[10px] tracking-wider uppercase text-nexus-muted">
              Invoices
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-nexus-gray">
                <tr className="font-mono text-[10px] tracking-wider uppercase text-nexus-muted">
                  <th className="p-3">User</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invQ.isLoading ? (
                  <tr>
                    <td className="p-3 font-mono text-xs text-nexus-muted" colSpan={3}>
                      Loading…
                    </td>
                  </tr>
                ) : invQ.isError ? (
                  <tr>
                    <td className="p-3 font-mono text-xs text-red-400" colSpan={3}>
                      Failed to load.
                    </td>
                  </tr>
                ) : (invQ.data?.items || []).length === 0 ? (
                  <tr>
                    <td className="p-3 font-mono text-xs text-nexus-muted" colSpan={3}>
                      No invoices.
                    </td>
                  </tr>
                ) : (
                  invQ.data!.items.map((i) => (
                    <tr key={i.id} className="border-b border-nexus-gray/60">
                      <td className="p-3 font-mono text-xs text-nexus-muted">{i.userId}</td>
                      <td className="p-3 font-mono text-xs">{i.status}</td>
                      <td className="p-3 font-mono text-xs">
                        {i.amount} {i.currency.toUpperCase()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminPage>
  );
}
