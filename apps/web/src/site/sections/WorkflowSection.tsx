'use client';

import { SectionHeader } from '@pytholit/ui/blocks';
import { ArrowUpRight, MessageSquare, Rocket, Zap } from 'lucide-react';

import { WORKFLOW_STEPS } from '@/site/data/home';

const ICONS: Record<string, typeof MessageSquare> = {
  message: MessageSquare,
  zap: Zap,
  rocket: Rocket,
};

/**
 * Workflow section showing the build-to-deploy loop.
 */
export const WorkflowSection = () => {
  return (
    <section className="relative overflow-hidden border-b border-border-default px-6 py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(109,40,217,0.12),_transparent_55%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionHeader
          badge="WORKFLOW"
          icon={Rocket}
          title={
            <>
              From prompt to <span className="text-brand-primary">production</span>, fast.
            </>
          }
          subtitle="A tight loop for teams that ship Python services daily."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {WORKFLOW_STEPS.map((step, index) => {
            const Icon = ICONS[step.icon] ?? MessageSquare;
            return (
              <div
                key={step.id}
                className="group relative overflow-hidden border border-border-default bg-bg-panel/80 p-6 backdrop-blur"
              >
                <div className="absolute right-4 top-4 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  0{index + 1}
                </div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center border border-brand-primary/40 bg-brand-primary/10 text-brand-primary">
                  <Icon size={20} />
                </div>
                <h3 className="text-2xl font-sans font-bold mb-3">{step.title}</h3>
                <p className="mb-5 font-mono text-sm leading-relaxed text-text-secondary/70">
                  {step.description}
                </p>
                <div className="flex items-center justify-between border-t border-border-default/60 pt-4 font-mono text-xs uppercase tracking-widest text-text-muted">
                  <span>{step.meta}</span>
                  <ArrowUpRight
                    size={16}
                    className="text-text-muted transition-colors group-hover:text-brand-primary"
                  />
                </div>
                <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-brand-primary/10 blur-2xl" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
