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
      ? 'border-brand-accent bg-brand-accent/5'
      : 'border-brand-primary bg-brand-primary/10'
    : 'border-border-default bg-bg-app hover:border-text-secondary';
  const iconClass = selected
    ? accent === 'accent'
      ? 'text-brand-accent'
      : 'text-brand-primary'
    : 'text-text-muted group-hover:text-text-primary';
  const checkClass = accent === 'accent' ? 'text-brand-accent' : 'text-brand-primary';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative overflow-hidden border p-6 text-left transition-all ${borderClass}`}
    >
      <div className={`mb-4 ${iconClass}`}>
        <Icon size={20} />
      </div>
      <h3 className="mb-1 font-sans text-lg font-bold text-text-primary">{name}</h3>
      <p className="font-mono text-xs text-text-secondary/50">{description}</p>
      {selected && (
        <div className={`absolute top-0 right-0 p-2 ${checkClass}`}>
          <Check size={16} />
        </div>
      )}
    </button>
  );
};
