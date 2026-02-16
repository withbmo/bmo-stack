'use client';

import { SectionHeader } from '@pytholit/ui';
import { ArrowUpRight,MessageSquare, Rocket, Zap } from 'lucide-react';

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
    <section className="relative py-28 px-6 border-b border-nexus-gray overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(109,40,217,0.12),_transparent_55%)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <SectionHeader
          badge="WORKFLOW"
          icon={Rocket}
          title={
            <>
              From prompt to <span className="text-nexus-purple">production</span>, fast.
            </>
          }
          subtitle="A tight loop for teams that ship Python services daily."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {WORKFLOW_STEPS.map((step, index) => {
            const Icon = ICONS[step.icon] ?? MessageSquare;
            return (
              <div
                key={step.id}
                className="relative border border-nexus-gray bg-nexus-dark/80 backdrop-blur p-6 overflow-hidden group"
              >
                <div className="absolute right-4 top-4 text-[10px] font-mono uppercase tracking-widest text-nexus-muted">
                  0{index + 1}
                </div>
                <div className="w-12 h-12 border border-nexus-purple/40 bg-nexus-purple/10 text-nexus-purple flex items-center justify-center mb-5">
                  <Icon size={20} />
                </div>
                <h3 className="text-2xl font-sans font-bold mb-3">{step.title}</h3>
                <p className="font-mono text-sm text-nexus-light/70 leading-relaxed mb-5">
                  {step.description}
                </p>
                <div className="flex items-center justify-between border-t border-nexus-gray/60 pt-4 text-xs font-mono uppercase tracking-widest text-nexus-muted">
                  <span>{step.meta}</span>
                  <ArrowUpRight
                    size={16}
                    className="text-nexus-muted group-hover:text-nexus-purple transition-colors"
                  />
                </div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-nexus-purple/10 blur-2xl" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
