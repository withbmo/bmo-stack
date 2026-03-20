'use client';

import { STATS } from '@/site/data/home';

interface StatCardProps {
  label: string;
  value: string;
  detail?: string;
}

const StatCard = ({ label, value, detail }: StatCardProps) => (
  <div className="relative group">
    <h4 className="mb-2 font-mono text-sm uppercase tracking-widest text-brand-primary">{label}</h4>
    <p className="font-sans text-6xl font-bold text-text-primary transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-brand-primary group-hover:to-text-primary group-hover:bg-clip-text group-hover:text-transparent md:text-7xl">
      {value}
    </p>
    {detail && <p className="mt-4 max-w-sm font-mono text-xs text-text-secondary/60">{detail}</p>}
    <div className="absolute -bottom-4 left-0 h-[1px] w-full bg-border-default transition-all duration-500 group-hover:bg-brand-primary" />
  </div>
);

/**
 * Statistics section displaying platform metrics (matches website design)
 */
export const StatsSection = () => {
  return (
    <section className="relative overflow-hidden border-b border-border-default bg-bg-app py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,148,0.08),_transparent_55%)]" />
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 text-center md:grid-cols-3 md:text-left">
        {STATS.map((stat, idx) => (
          <StatCard key={idx} label={stat.label} value={stat.value} detail={stat.detail} />
        ))}
      </div>
    </section>
  );
};
