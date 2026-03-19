'use client';

import { Button } from '@pytholit/ui/ui';
import { ArrowUpRight, CheckCircle2, Play } from 'lucide-react';
import Link from 'next/link';

import { HERO_PYTHON_CODE } from '@/site/data/home';

const CTAItem = ({ text }: { text: string }) => (
  <div className="flex items-start gap-3 text-nexus-light/80 font-mono text-sm">
    <CheckCircle2 size={16} className="text-nexus-accent mt-0.5" />
    <span>{text}</span>
  </div>
);

/**
 * Call-to-action section at the bottom of the homepage (matches website design)
 */
export const CTASection = () => {
  return (
    <section className="py-32 px-6 bg-nexus-dark relative overflow-hidden border-t border-nexus-gray">
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-nexus-purple to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(109,40,217,0.2),_transparent_55%)]" />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div>
          {/* Headline */}
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            READY TO <br />
            <span className="text-nexus-purple">ASCEND?</span>
          </h2>

          {/* Subtext */}
          <p className="font-mono text-nexus-light/60 mb-8 max-w-xl">
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

        <div className="border border-nexus-gray bg-nexus-black/80 backdrop-blur p-8 space-y-5">
          <div className="text-xs font-mono uppercase tracking-widest text-nexus-muted">
            What you get
          </div>
          <CTAItem text="One runtime for dev, staging, and prod." />
          <CTAItem text="Global deploys with instant rollbacks." />
          <CTAItem text="Built-in observability and access controls." />
          <div className="border border-nexus-gray/60 bg-black/40 px-4 py-3 text-[11px] font-mono text-nexus-light/70">
            Deploy in minutes. Scale in seconds.
          </div>
        </div>
      </div>

      {/* Background Code Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] font-mono text-xs overflow-hidden pointer-events-none p-4 select-none">
        {Array(50).fill(HERO_PYTHON_CODE).join('\n')}
      </div>
    </section>
  );
};
