import { Terminal } from 'lucide-react';

import { Button } from '@/dashboard/components';
import type { ProjectWizardConfig } from '@/shared/constants/project-wizard';

interface StepReviewProps {
  config: ProjectWizardConfig;
  onBack: () => void;
  onDeploy: () => void;
  isDeploying: boolean;
}

export const StepReview = ({ config, onBack, onDeploy, isDeploying }: StepReviewProps) => {
  const scaffolding =
    [
      config.dockerCompose && 'Compose',
      config.typeHinting && `Type hinting (${config.typeHintingLevel.toUpperCase()})`,
      config.formatters && `Formatter (${config.formatterChoice.toUpperCase()})`,
      config.makefile && 'Makefile',
      config.testingFolder && 'Tests',
      config.framework === 'fastapi' && config.alembic && 'Alembic',
    ]
      .filter(Boolean)
      .join(', ') || 'NONE';

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="bg-[#080808] border border-nexus-gray p-8 mb-8 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nexus-purple to-nexus-accent" />

        <h3 className="font-sans font-bold text-2xl text-white mb-6">MANIFEST SUMMARY</h3>

        <div className="space-y-6 font-mono text-sm">
          <div className="flex justify-between border-b border-nexus-gray/30 pb-4">
            <span className="text-nexus-muted uppercase">Project Name</span>
            <span className="text-white">{config.name}</span>
          </div>
          <div className="flex justify-between border-b border-nexus-gray/30 pb-4">
            <span className="text-nexus-muted uppercase">Description</span>
            <span className="text-white text-right max-w-[60%]">{config.description || '—'}</span>
          </div>
          <div className="flex justify-between border-b border-nexus-gray/30 pb-4">
            <span className="text-nexus-muted uppercase">Runtime Framework</span>
            <span className="text-nexus-purple font-bold uppercase">{config.framework}</span>
          </div>
          <div className="flex justify-between border-b border-nexus-gray/30 pb-4">
            <span className="text-nexus-muted uppercase">Visibility</span>
            <span className="text-white uppercase">{config.visibility}</span>
          </div>
          <div className="flex justify-between border-b border-nexus-gray/30 pb-4">
            <span className="text-nexus-muted uppercase">Region</span>
            <span className="text-white uppercase">{config.region}</span>
          </div>
          <div className="flex justify-between border-b border-nexus-gray/30 pb-4">
            <span className="text-nexus-muted uppercase">Structure</span>
            <span className="text-white uppercase">{config.structure}</span>
          </div>
          <div className="flex justify-between border-b border-nexus-gray/30 pb-4">
            <span className="text-nexus-muted uppercase">Dependencies</span>
            <span className="text-white uppercase">{config.dependencyManager}</span>
          </div>
          <div className="flex justify-between border-b border-nexus-gray/30 pb-4">
            <span className="text-nexus-muted uppercase">Databases</span>
            <span className="text-nexus-accent">
              {config.databases.length > 0 ? config.databases.join(', ').toUpperCase() : 'NONE'}
            </span>
          </div>
          <div className="flex justify-between border-b border-nexus-gray/30 pb-4">
            <span className="text-nexus-muted uppercase">Runtime</span>
            <span className="text-white uppercase">
              {config.cpu} CPU / {config.memory} MB / {config.port} PORT
            </span>
          </div>
          <div className="flex justify-between border-b border-nexus-gray/30 pb-4">
            <span className="text-nexus-muted uppercase">Scaffolding</span>
            <span className="text-white">{scaffolding}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-nexus-muted uppercase">Env Vars</span>
            <span className="text-white">{config.envVars.filter(row => row.key).length}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 bg-transparent border border-nexus-gray text-nexus-muted font-mono font-bold py-4 hover:text-white hover:border-white transition-colors"
        >
          BACK
        </button>
        <Button
          variant="primary"
          size="md"
          onClick={onDeploy}
          isLoading={isDeploying}
          className="flex-[2] justify-center"
        >
          <Terminal size={18} />
          DEPLOY ENVIRONMENT
        </Button>
      </div>
    </div>
  );
};
