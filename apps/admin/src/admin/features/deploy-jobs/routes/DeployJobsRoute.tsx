'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button, Card } from '@pytholit/ui';
import { AdminPage } from '@/admin/shared/components/AdminPage';
import { useAuth } from '@/shared/auth';
import { getApiErrorMessage } from '@/shared/lib/client';
import { adminCancelDeployJob, adminListDeployJobs } from '@/shared/lib/admin';

export function DeployJobsRoute() {
  const { token } = useAuth();
  const qc = useQueryClient();
  const [status, setStatus] = useState<string>(''); // empty => all

  const queryKey = useMemo(() => ['admin', 'deploy-jobs', { status }], [status]);
  const jobsQ = useQuery({
    queryKey,
    queryFn: () => adminListDeployJobs(token || '', { status, page: 1, pageSize: 50 }),
    enabled: !!token,
  });

  const cancelM = useMutation({
    mutationFn: (jobId: string) => adminCancelDeployJob(token || '', jobId),
    onSuccess: async () => {
      toast.success('Cancel requested.');
      await qc.invalidateQueries({ queryKey: ['admin', 'deploy-jobs'] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Cancel failed')),
  });

  return (
    <AdminPage
      title="DeployJobs"
      subtitle="Monitor and cancel cross-user deployments"
      right={
        <div className="flex items-center gap-2">
          <div className="font-mono text-[10px] tracking-wider uppercase text-nexus-muted">
            Status
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-nexus-black border border-nexus-gray text-white font-mono text-xs px-2 py-2"
          >
            <option value="">ALL</option>
            <option value="queued">QUEUED</option>
            <option value="running">RUNNING</option>
            <option value="succeeded">SUCCEEDED</option>
            <option value="failed">FAILED</option>
            <option value="canceled">CANCELED</option>
          </select>
        </div>
      }
    >
      <Card className="p-0 overflow-hidden bg-bg-panel border border-nexus-gray">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-nexus-black border-b border-nexus-gray">
              <tr className="font-mono text-[10px] tracking-wider uppercase text-nexus-muted">
                <th className="p-3">ID</th>
                <th className="p-3">Status</th>
                <th className="p-3">Project</th>
                <th className="p-3">Environment</th>
                <th className="p-3">Created</th>
                <th className="p-3 w-[140px]" />
              </tr>
            </thead>
            <tbody>
              {jobsQ.isLoading ? (
                <tr>
                  <td className="p-3 font-mono text-xs text-nexus-muted" colSpan={6}>
                    Loading…
                  </td>
                </tr>
              ) : jobsQ.isError ? (
                <tr>
                  <td className="p-3 font-mono text-xs text-red-400" colSpan={6}>
                    Failed to load.
                  </td>
                </tr>
              ) : (jobsQ.data?.items || []).length === 0 ? (
                <tr>
                  <td className="p-3 font-mono text-xs text-nexus-muted" colSpan={6}>
                    No jobs.
                  </td>
                </tr>
              ) : (
                jobsQ.data!.items.map((j) => (
                  <tr key={j.id} className="border-b border-nexus-gray/60">
                    <td className="p-3 font-mono text-xs">{j.id}</td>
                    <td className="p-3 font-mono text-xs">{j.status}</td>
                    <td className="p-3 font-mono text-xs text-nexus-muted">{j.projectId}</td>
                    <td className="p-3 font-mono text-xs text-nexus-muted">{j.environmentId}</td>
                    <td className="p-3 font-mono text-xs text-nexus-muted">{j.createdAt}</td>
                    <td className="p-3 flex justify-end">
                      <Button
                        variant="secondary"
                        onClick={() => cancelM.mutate(j.id)}
                        disabled={cancelM.isPending}
                      >
                        Cancel
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

