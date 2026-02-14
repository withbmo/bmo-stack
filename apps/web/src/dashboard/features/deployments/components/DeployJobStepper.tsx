import type { DeployJobStep } from '@/shared/types';

const statusStyles: Record<DeployJobStep['status'], string> = {
  queued: 'border-border-dim text-nexus-muted',
  running: 'border-nexus-purple text-nexus-purple animate-pulse',
  succeeded: 'border-nexus-accent text-nexus-accent',
  failed: 'border-red-500 text-red-500',
  skipped: 'border-nexus-gray text-nexus-muted line-through',
};

export const DeployJobStepper = ({ steps }: { steps: DeployJobStep[] }) => {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div
          key={step.key}
          className="flex items-center gap-4 bg-bg-panel border border-border-dim px-4 py-3"
        >
          <div
            className={`w-8 h-8 flex items-center justify-center border font-mono text-xs ${
              statusStyles[step.status]
            }`}
          >
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="text-sm text-white font-mono">{step.title}</div>
            <div className="text-[10px] uppercase tracking-wider font-mono text-nexus-muted">
              {step.key}
            </div>
          </div>
          <div
            className={`text-[10px] uppercase tracking-wider font-mono border px-2 py-1 ${
              statusStyles[step.status]
            }`}
          >
            {step.status}
          </div>
        </div>
      ))}
    </div>
  );
};
