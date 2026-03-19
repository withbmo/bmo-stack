import { Modal } from '@pytholit/ui/ui';
import { RefreshCw, Rocket } from 'lucide-react';

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

      <select
        value={selectedProjectId}
        onChange={e => onSelectedProjectChange(e.target.value)}
        className="w-full bg-nexus-dark border border-nexus-gray p-3 font-mono text-sm text-white focus:border-nexus-purple focus:ring-1 focus:ring-nexus-purple/30 outline-none mb-6"
      >
        <option value="">Choose project...</option>
        {projects.map(p => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.region})
          </option>
        ))}
      </select>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => !isDeploying && onClose()}
          className="px-4 py-2 border border-nexus-gray text-nexus-muted font-mono text-xs font-bold hover:text-white hover:border-white transition-colors"
        >
          CANCEL
        </button>
        <button
          type="button"
          onClick={onDeploy}
          disabled={!selectedProjectId || isDeploying}
          className="px-4 py-2 bg-nexus-purple text-white font-mono text-xs font-bold hover:bg-nexus-neon disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
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
        </button>
      </div>
    </Modal>
  );
};
