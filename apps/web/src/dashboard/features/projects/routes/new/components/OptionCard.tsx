import type { LucideIcon } from 'lucide-react';
import { Check } from 'lucide-react';

interface OptionCardProps {
  selected: boolean;
  onSelect: () => void;
  icon: LucideIcon | React.FC<{ size?: number }>;
  name: string;
  description: string;
  accent?: 'purple' | 'accent';
}

export const OptionCard = ({
  selected,
  onSelect,
  icon: Icon,
  name,
  description,
  accent = 'purple',
}: OptionCardProps) => {
  const borderClass = selected
    ? accent === 'accent'
      ? 'border-nexus-accent bg-nexus-accent/5'
      : 'border-nexus-purple bg-nexus-purple/10'
    : 'border-nexus-gray bg-[#080808] hover:border-nexus-light';
  const iconClass = selected
    ? accent === 'accent'
      ? 'text-nexus-accent'
      : 'text-nexus-purple'
    : 'text-nexus-muted group-hover:text-white';
  const checkClass = accent === 'accent' ? 'text-nexus-accent' : 'text-nexus-purple';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative p-6 border text-left transition-all group overflow-hidden ${borderClass}`}
    >
      <div className={`mb-4 ${iconClass}`}>
        <Icon size={20} />
      </div>
      <h3 className="font-sans font-bold text-lg text-white mb-1">{name}</h3>
      <p className="font-mono text-xs text-nexus-light/50">{description}</p>
      {selected && (
        <div className={`absolute top-0 right-0 p-2 ${checkClass}`}>
          <Check size={16} />
        </div>
      )}
    </button>
  );
};
