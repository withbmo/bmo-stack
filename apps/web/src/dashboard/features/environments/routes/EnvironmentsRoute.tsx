'use client';

import { EnvironmentsSkeleton } from '@pytholit/ui';
import { useMutation } from '@tanstack/react-query';
import { Layers, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button, DashboardTabs, EmptyState } from '@/dashboard/components';
import { useAuth } from '@/shared/auth';
import { DashboardPageHeader,PageLayout } from '@/shared/components/layout';
import { getApiErrorMessage } from '@/shared/lib';
import { startEnvironment, stopEnvironment, terminateEnvironment } from '@/shared/lib/environments';

import { EnvironmentList } from '../../projects/components/EnvironmentList';
import { useEnvironments, useUpdateEnvironment } from '../../projects/hooks/useEnvironments';

const tabs = ['environments'] as const;

export const EnvironmentsRoute = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('environments');
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  const { user, hydrated } = useAuth();
  const { data: environments = [], isLoading: envLoading } = useEnvironments();
  const updateEnv = useUpdateEnvironment();

  const startMutation = useMutation({
    mutationFn: async (envId: string) => {
      if (!hydrated || !user) throw new Error('Not authenticated');
      return startEnvironment(undefined, envId);
    },
    onError: err => {
      const msg =
        err instanceof Error ? err.message : getApiErrorMessage(err, 'Failed to start environment');
      toast.error(msg);
    },
    onSettled: () => setActiveActionId(null),
  });

  const stopMutation = useMutation({
    mutationFn: async (envId: string) => {
      if (!hydrated || !user) throw new Error('Not authenticated');
      return stopEnvironment(undefined, envId);
    },
    onError: err => {
      const msg =
        err instanceof Error ? err.message : getApiErrorMessage(err, 'Failed to stop environment');
      toast.error(msg);
    },
    onSettled: () => setActiveActionId(null),
  });

  const terminateMutation = useMutation({
    mutationFn: async (envId: string) => {
      if (!hydrated || !user) throw new Error('Not authenticated');
      return terminateEnvironment(undefined, envId);
    },
    onError: err => {
      const msg =
        err instanceof Error
          ? err.message
          : getApiErrorMessage(err, 'Failed to terminate environment');
      toast.error(msg);
    },
    onSettled: () => setActiveActionId(null),
  });

  const projectTabs = [{ value: 'environments', label: 'ENVIRONMENTS' }];

  return (
    <PageLayout className="pb-12">
      <DashboardPageHeader
        badge={{ icon: Layers, label: 'ENVIRONMENTS' }}
        title={
          <>
            <span className="text-nexus-muted">YOUR</span> ENVIRONMENTS
          </>
        }
        subtitle="Create environments once and reuse them across projects."
        actions={null}
      />

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="text-xs font-mono text-nexus-muted">
          {environments.length} environment{environments.length === 1 ? '' : 's'}
        </div>
        <Button size="sm" onClick={() => router.push('/dashboard/environments/new')}>
          <Plus size={16} /> NEW ENVIRONMENT
        </Button>
      </div>

      <DashboardTabs
        tabs={projectTabs}
        active={activeTab}
        onChange={value => setActiveTab(value as typeof activeTab)}
        size="small"
        className="mb-8"
      />

      {envLoading ? (
        <EnvironmentsSkeleton />
      ) : environments.length === 0 ? (
        <EmptyState message="No environments yet." />
      ) : (
        <EnvironmentList
          environments={environments}
          onUpdate={(envId, updates) =>
            updateEnv.mutate(
              {
                envId,
                // Only send fields the user actually changed.
                payload: (() => {
                  const payload: any = {};

                  if ('executionMode' in updates) {
                    payload.executionMode = updates.executionMode;
                  }
                  if ('visibility' in updates) {
                    payload.visibility = updates.visibility;
                  }
                  if ('region' in updates) {
                    payload.region = updates.region ?? null;
                  }
                  if ('config' in updates) {
                    payload.config = (updates.config ?? null) as Record<string, unknown> | null;
                  }
                  return payload;
                })(),
              },
              {
                onError: err => {
                  const msg =
                    err instanceof Error
                      ? err.message
                      : getApiErrorMessage(err, 'Failed to update environment');
                  toast.error(msg);
                },
              }
            )
          }
          onStart={envId => {
            setActiveActionId(envId);
            startMutation.mutate(envId);
          }}
          onOpenTerminal={envId => {
            router.push(`/dashboard/environments/${envId}/terminal`);
          }}
          onStop={envId => {
            setActiveActionId(envId);
            stopMutation.mutate(envId);
          }}
          onTerminate={envId => {
            setActiveActionId(envId);
            terminateMutation.mutate(envId);
          }}
          activeActionId={activeActionId}
        />
      )}
    </PageLayout>
  );
};
