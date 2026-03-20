'use client';

import { Button } from '@pytholit/ui/ui';
import { ArrowUpRight, CheckCircle2, Play } from 'lucide-react';
import Link from 'next/link';

import { HERO_PYTHON_CODE } from '@/site/data/home';

const CTAItem = ({ text }: { text: string }) => (
  <div className="flex items-start gap-3 font-mono text-sm text-text-secondary/80">
    <CheckCircle2 size={16} className="mt-0.5 text-brand-accent" />
    <span>{text}</span>
  </div>
);

/**
 * Call-to-action section at the bottom of the homepage (matches website design)
 */
export const CTASection = () => {
  return (
    <section className="relative overflow-hidden border-t border-border-default bg-bg-panel px-6 py-32">
      {/* Top Gradient Line */}
      <div className="absolute left-0 top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(109,40,217,0.2),_transparent_55%)]" />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          {/* Headline */}
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            READY TO <br />
            <span className="text-brand-primary">ASCEND?</span>
          </h2>

          {/* Subtext */}
          <p className="mb-8 max-w-xl font-mono text-text-secondary/60">
            Join 4.2M+ developers building the future on Pytholit. No credit card required for dev
            environments.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Button variant="primary" size="md" asChild>
              <Link href="/auth/signup">
                <Play fill="white" size={20} />
                START RUNTIME
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/docs">
                <ArrowUpRight size={18} />
                VIEW DOCS
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-5 border border-border-default bg-bg-app/80 p-8 backdrop-blur">
          <div className="font-mono text-xs uppercase tracking-widest text-text-muted">
            What you get
          </div>
          <CTAItem text="One runtime for dev, staging, and prod." />
          <CTAItem text="Global deploys with instant rollbacks." />
          <CTAItem text="Built-in observability and access controls." />
          <div className="border border-border-default/60 bg-bg-overlay/60 px-4 py-3 font-mono text-[11px] text-text-secondary/70">
            Deploy in minutes. Scale in seconds.
          </div>
        </div>
      </div>

      {/* Background Code Pattern */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full select-none overflow-hidden p-4 font-mono text-xs opacity-[0.03]">
        {Array(50).fill(HERO_PYTHON_CODE).join('\n')}
      </div>
    </section>
  );
};
