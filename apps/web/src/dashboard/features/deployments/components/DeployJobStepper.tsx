import type { DeployJobStep } from '@/shared/types';

const statusStyles: Record<DeployJobStep['status'], string> = {
  queued: 'border-border-dim text-text-muted',
  running: 'border-brand-primary text-brand-primary animate-pulse',
  succeeded: 'border-brand-accent text-brand-accent',
  failed: 'border-red-500 text-red-500',
  skipped: 'border-border-default text-text-muted line-through',
};

export const DeployJobStepper = ({ steps }: { steps: DeployJobStep[] }) => {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div
          key={step.key}
          className="flex items-center gap-4 border border-border-dim bg-bg-panel px-4 py-3"
        >
          <div
            className={`flex h-8 w-8 items-center justify-center border font-mono text-xs ${
              statusStyles[step.status]
            }`}
          >
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="font-mono text-sm text-text-primary">{step.title}</div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
              {step.key}
            </div>
          </div>
          <div
            className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-wider ${
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
