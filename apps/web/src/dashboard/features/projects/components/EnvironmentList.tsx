import type { Environment } from '@/shared/types';

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
    return (
      <div className="border border-border-dim bg-bg-panel p-6 text-center text-nexus-muted font-mono text-sm">
        No environments yet. Create one to start deploying.
      </div>
    );
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
