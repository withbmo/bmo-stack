import {
  Modal,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui';
import { RefreshCw, Rocket } from 'lucide-react';

import { Button } from '@/ui/shadcn/ui/button';
import type { Project } from '@/shared/types';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  selectedProjectId: string;
  onSelectedProjectChange: (id: string) => void;
  onDeploy: () => void;
  isDeploying: boolean;
}

export const DeployModal = ({
  isOpen,
  onClose,
  projects,
  selectedProjectId,
  onSelectedProjectChange,
  onDeploy,
  isDeploying,
}: DeployModalProps) => {
  const projectOptions = projects.map(project => ({
    value: project.id,
    label: `${project.name} (${project.region})`,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} isLoading={isDeploying} variant="default">
      {/* Custom title with icon */}
      <div className="flex items-center gap-2 -mt-6 mb-6">
        <span className="font-mono text-xs font-bold text-brand-primary tracking-widest uppercase flex items-center gap-2">
          <Rocket size={14} /> DEPLOY_PROJECT
        </span>
      </div>

      <p className="font-mono text-sm text-text-secondary mb-4">
        Select a project to deploy. Deployed projects will appear in the list with status.
      </p>

      <div className="relative mb-6">
        <Select value={selectedProjectId} onValueChange={onSelectedProjectChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choose project..." options={projectOptions} />
          </SelectTrigger>
          <SelectContent>
            {projectOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3 justify-end">
        <Button onClick={() => !isDeploying && onClose()}>
          CANCEL
        </Button>
        <Button onClick={onDeploy} disabled={!selectedProjectId || isDeploying}>
          {isDeploying ? (
            <>
              <RefreshCw size={12} className="animate-spin" />
              DEPLOYING...
            </>
          ) : (
            <>
              <Rocket size={12} />
              DEPLOY
            </>
          )}
        </Button>
      </div>
    </Modal>
  );
};
