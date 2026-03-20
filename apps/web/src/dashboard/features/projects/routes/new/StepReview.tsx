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
      <div className="relative mb-8 border border-border-default bg-bg-app p-8">
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-brand-primary to-brand-accent" />

        <h3 className="mb-6 font-sans text-2xl font-bold text-text-primary">MANIFEST SUMMARY</h3>

        <div className="space-y-6 font-mono text-sm">
          <div className="flex justify-between border-b border-border-default/30 pb-4">
            <span className="uppercase text-text-muted">Project Name</span>
            <span className="text-text-primary">{config.name}</span>
          </div>
          <div className="flex justify-between border-b border-border-default/30 pb-4">
            <span className="uppercase text-text-muted">Description</span>
            <span className="max-w-[60%] text-right text-text-primary">
              {config.description || '—'}
            </span>
          </div>
          <div className="flex justify-between border-b border-border-default/30 pb-4">
            <span className="uppercase text-text-muted">Runtime Framework</span>
            <span className="font-bold uppercase text-brand-primary">{config.framework}</span>
          </div>
          <div className="flex justify-between border-b border-border-default/30 pb-4">
            <span className="uppercase text-text-muted">Visibility</span>
            <span className="uppercase text-text-primary">{config.visibility}</span>
          </div>
          <div className="flex justify-between border-b border-border-default/30 pb-4">
            <span className="uppercase text-text-muted">Region</span>
            <span className="uppercase text-text-primary">{config.region}</span>
          </div>
          <div className="flex justify-between border-b border-border-default/30 pb-4">
            <span className="uppercase text-text-muted">Structure</span>
            <span className="uppercase text-text-primary">{config.structure}</span>
          </div>
          <div className="flex justify-between border-b border-border-default/30 pb-4">
            <span className="uppercase text-text-muted">Dependencies</span>
            <span className="uppercase text-text-primary">{config.dependencyManager}</span>
          </div>
          <div className="flex justify-between border-b border-border-default/30 pb-4">
            <span className="uppercase text-text-muted">Databases</span>
            <span className="text-brand-accent">
              {config.databases.length > 0 ? config.databases.join(', ').toUpperCase() : 'NONE'}
            </span>
          </div>
          <div className="flex justify-between border-b border-border-default/30 pb-4">
            <span className="uppercase text-text-muted">Runtime</span>
            <span className="uppercase text-text-primary">
              {config.cpu} CPU / {config.memory} MB / {config.port} PORT
            </span>
          </div>
          <div className="flex justify-between border-b border-border-default/30 pb-4">
            <span className="uppercase text-text-muted">Scaffolding</span>
            <span className="text-text-primary">{scaffolding}</span>
          </div>
          <div className="flex justify-between">
            <span className="uppercase text-text-muted">Env Vars</span>
            <span className="text-text-primary">{config.envVars.filter(row => row.key).length}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={onBack}
          variant="secondary"
          size="md"
          className="flex-1 border border-border-default bg-transparent text-text-muted hover:border-text-primary hover:text-text-primary"
        >
          BACK
        </Button>
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
