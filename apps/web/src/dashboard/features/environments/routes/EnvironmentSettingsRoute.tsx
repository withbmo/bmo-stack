'use client';

import { Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  Button,
  Card,
  DashboardPageHeader,
  DashboardTabs,
  DynamicSkeletonProvider,
  DynamicSlot,
  EmptyState,
  Input,
  Modal,
  PageLayout,
  Skeleton,
} from '@/dashboard/components';
import { getApiErrorMessage } from '@/shared/lib';

import { useDeleteEnvironment, useEnvironments } from '../../projects/hooks/useEnvironments';

const tabs = [
  { value: 'general', label: 'GENERAL' },
  { value: 'danger', label: 'DANGER ZONE' },
];

interface EnvironmentSettingsRouteProps {
  envId: string;
}

export const EnvironmentSettingsRoute = ({ envId }: EnvironmentSettingsRouteProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmName, setConfirmName] = useState('');
  // Snapshotted when the modal opens — immune to background re-fetches clearing `environment`.
  const [snapshotDisplayName, setSnapshotDisplayName] = useState('');

  const { data: environments = [], isLoading } = useEnvironments();
  const { mutate: deleteEnv, isPending } = useDeleteEnvironment();

  const environment = environments.find(e => e.id === envId);

  const openConfirmModal = () => {
    setSnapshotDisplayName(environment?.displayName ?? '');
    setConfirmName('');
    setConfirmOpen(true);
  };

  const handleDelete = () => {
    deleteEnv(envId, {
      onSuccess: () => {
        setConfirmOpen(false);
        toast.success('Environment deleted');
        router.push('/dashboard/environments');
      },
      onError: err => {
        toast.error(getApiErrorMessage(err, 'Failed to delete environment'));
        setConfirmOpen(false);
      },
    });
  };

  return (
    <DynamicSkeletonProvider loading={isLoading}>
    <PageLayout className="pb-12">
      <DashboardPageHeader
        badge={{ icon: Settings, label: 'SETTINGS' }}
        title={
          <>
            <span className="text-nexus-muted">ENVIRONMENT</span> SETTINGS
          </>
        }
        subtitle={
          environment
            ? `Configure settings for ${environment.displayName || environment.envType}`
            : 'Environment settings'
        }
        actions={null}
      />

      <DashboardTabs
        tabs={tabs}
        active={activeTab}
        onChange={setActiveTab}
        size="small"
        className="mb-8"
      />

      <DynamicSlot
        skeleton={
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="bg-bg-panel border border-border-dim p-6 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-6 w-40" />
                  </div>
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-9 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        }
      >
      {!environment ? (
        <EmptyState message="Environment not found." />
      ) : activeTab === 'general' ? (
        <Card className="max-w-lg space-y-4">
          {(
            [
              { label: 'Env Type', value: environment.envType },
              { label: 'Display Name', value: environment.displayName },
              { label: 'Region', value: environment.region ?? 'Unassigned' },
              { label: 'Visibility', value: environment.visibility },
              { label: 'Execution Mode', value: environment.executionMode },
            ] as const
          ).map(({ label, value }) => (
            <div key={label}>
              <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-1">
                {label}
              </div>
              <div className="font-mono text-sm text-white border border-border-dim bg-bg-panel px-3 py-2">
                {value}
              </div>
            </div>
          ))}
        </Card>
      ) : (
        <Card className="max-w-lg border-red-500/30 bg-red-500/5 p-6">
          <h3 className="text-red-400 font-mono text-xs uppercase tracking-widest mb-2">
            Danger Zone
          </h3>
          <p className="text-text-secondary text-sm mb-4">
            Deleting this environment removes it permanently from the dashboard. This action cannot
            be undone.
          </p>
          <Button variant="danger" size="sm" onClick={openConfirmModal}>
            Delete Environment
          </Button>
        </Card>
      )}
      </DynamicSlot>

      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete Environment"
        isLoading={isPending}
      >
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">
            This action is permanent and cannot be undone. Type{' '}
            <span className="font-mono text-white">{snapshotDisplayName}</span> to confirm.
          </p>
          <Input
            type="text"
            value={confirmName}
            onChange={e => setConfirmName(e.target.value)}
            placeholder={snapshotDisplayName}
            variant="panel"
            intent="danger"
            size="sm"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              disabled={!snapshotDisplayName || confirmName.trim() !== snapshotDisplayName.trim()}
              isLoading={isPending}
            >
              Delete Environment
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
    </DynamicSkeletonProvider>
  );
};
