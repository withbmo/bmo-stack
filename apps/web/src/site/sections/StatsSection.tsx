'use client';

import { STATS } from '@/site/data/home';

interface StatCardProps {
  label: string;
  value: string;
  detail?: string;
}

const StatCard = ({ label, value, detail }: StatCardProps) => (
  <div className="relative group">
    <h4 className="font-mono text-nexus-purple text-sm mb-2 tracking-widest uppercase">{label}</h4>
    <p className="font-sans font-bold text-6xl md:text-7xl text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-nexus-purple group-hover:to-white transition-all duration-300">
      {value}
    </p>
    {detail && <p className="mt-4 font-mono text-xs text-nexus-light/60 max-w-sm">{detail}</p>}
    <div className="absolute -bottom-4 left-0 w-full h-[1px] bg-nexus-gray group-hover:bg-nexus-purple transition-all duration-500" />
  </div>
);

/**
 * Statistics section displaying platform metrics (matches website design)
 */
export const StatsSection = () => {
  return (
    <section className="py-24 border-b border-nexus-gray bg-nexus-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,148,0.08),_transparent_55%)]" />
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left relative z-10">
        {STATS.map((stat, idx) => (
          <StatCard key={idx} label={stat.label} value={stat.value} detail={stat.detail} />
        ))}
      </div>
    </section>
  );
};
