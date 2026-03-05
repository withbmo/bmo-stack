import type { Environment } from '@/shared/types';
import { EmptyState } from '@/dashboard/components';

import { EnvironmentCard } from './EnvironmentCard';

interface EnvironmentListProps {
  environments: Environment[];
  onUpdate: (envId: string, updates: Partial<Environment>) => void;
  onDeploy?: (envId: string) => void;
  onOpenTerminal?: (envId: string) => void;
  onStart?: (envId: string) => void;
  onStop?: (envId: string) => void;
  onTerminate?: (envId: string) => void;
  activeActionId?: string | null;
  activeDeployId?: string | null;
}

export const EnvironmentList = ({
  environments,
  onUpdate,
  onDeploy,
  onOpenTerminal,
  onStart,
  onStop,
  onTerminate,
  activeActionId,
  activeDeployId,
}: EnvironmentListProps) => {
  if (environments.length === 0) {
    return <EmptyState message="No environments yet. Create one to start deploying." />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {environments.map(environment => (
        <EnvironmentCard
          key={environment.id}
          environment={environment}
          onUpdate={onUpdate}
          onDeploy={onDeploy}
          onOpenTerminal={onOpenTerminal}
          onStart={onStart}
          onStop={onStop}
          onTerminate={onTerminate}
          isDeploying={activeDeployId === environment.id}
          isActing={activeActionId === environment.id}
        />
      ))}
    </div>
  );
};
