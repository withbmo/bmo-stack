import { useState } from 'react';
import { Zap, Cloud, Code2, Cpu, ArrowUpRight, Database } from 'lucide-react';
import type { Feature } from '../../types';

function getFeatureIcon(icon: string) {
  switch (icon) {
    case 'zap':
      return Zap;
    case 'cloud':
      return Cloud;
    case 'users':
      return Code2;
    default:
      return Cpu;
  }
}

export interface FeatureCardProps {
  feature: Feature;
}

export const FeatureCard = ({ feature }: FeatureCardProps) => {
  const [hovered, setHovered] = useState(false);
  const Icon = getFeatureIcon(feature.icon);

  return (
    <div
      className="group relative h-80 bg-bg-panel border-2 border-border-dim transition-all duration-300 hover:border-brand-primary overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      <div
        className={`absolute inset-0 p-8 flex flex-col justify-between transition-transform duration-500 ${hovered ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}
      >
        <div>
          <div className="w-12 h-12 bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center mb-6 text-brand-primary">
            <Icon size={24} />
          </div>
          <h3 className="font-sans font-bold text-2xl mb-2">{feature.title}</h3>
          <p className="font-mono text-sm text-text-secondary/80 leading-relaxed">
            {feature.description}
          </p>
        </div>
        <div className="flex justify-between items-center border-t border-border-dim pt-4">
          <span className="font-mono text-xs text-text-secondary">
            0{feature.id.replace('f', '')}
          </span>
          <ArrowUpRight size={18} className="text-text-secondary group-hover:text-brand-primary" />
        </div>
      </div>

      <div
        className={`absolute inset-0 bg-brand-primary p-8 flex flex-col justify-center transition-transform duration-500 ${hovered ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="font-mono text-sm text-white mb-2 opacity-50"># Source Code</div>
        <pre className="font-mono text-sm text-white font-bold leading-relaxed whitespace-pre-wrap">
          {feature.pythonCode}
        </pre>
        <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-black/20 w-fit px-2 py-1 text-white/80">
          <Database size={12} />
          COMPILED_FRAGMENT
        </div>
        <div className="absolute bottom-4 right-4 animate-spin-slow">
          <Cpu size={100} className="text-black/10" />
        </div>
      </div>
    </div>
  );
};

FeatureCard.displayName = 'FeatureCard';
