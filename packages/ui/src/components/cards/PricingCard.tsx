import { Check } from 'lucide-react';
import type { PricingPlan } from '../../types';
import { Button } from '../Button';

interface PricingCardProps {
  plan: PricingPlan;
  onAction?: () => void;
  actionDisabled?: boolean;
}

/**
 * Pricing tier card component
 * Displays plan details with features list and CTA button
 */
export const PricingCard = ({ plan, onAction, actionDisabled }: PricingCardProps) => {
  const { name, price, period, monthlyPrice, description, features, recommended, buttonText } =
    plan;

  const resolvedPrice = price ?? (typeof monthlyPrice === 'number' ? `$${monthlyPrice}` : '$0');
  const resolvedPeriod = period ?? '/month';
  const resolvedButtonText = buttonText ?? 'GET_STARTED';

  return (
    <div
      className={`relative min-w-0 bg-bg-panel/90 backdrop-blur border-2 p-8 transition-all duration-300 hover:-translate-y-2 group
        ${
          recommended
            ? 'border-brand-primary nexus-shadow'
            : 'border-border-dim hover:border-border-default'
        }
      `}
    >
      {/* Recommended Badge */}
      {recommended && (
        <div className="mb-6 flex justify-center">
          <RecommendedBadge />
        </div>
      )}

      {/* Plan Header */}
      <PlanHeader
        name={name}
        price={resolvedPrice}
        period={resolvedPeriod}
        description={description}
      />

      {/* Features List */}
      <FeaturesList features={features} recommended={recommended} />

      {/* CTA Button */}
      <CTAButton
        text={resolvedButtonText}
        recommended={recommended}
        onClick={onAction}
        disabled={actionDisabled}
      />
    </div>
  );
};

const RecommendedBadge = () => (
  <div className="bg-brand-primary text-white font-mono text-xs font-bold px-4 py-1 uppercase tracking-widest border border-white whitespace-nowrap">
    RECOMMENDED BUILD
  </div>
);

interface PlanHeaderProps {
  name: string;
  price: string;
  period: string;
  description: string;
}

const PlanHeader = ({ name, price, period, description }: PlanHeaderProps) => (
  <div className="mb-8 border-b border-border-dim/50 pb-6 min-w-0">
    <h3 className="font-mono text-brand-primary text-sm mb-2 tracking-widest">{name}</h3>
    <div className="flex flex-wrap items-baseline gap-1 min-w-0">
      <span className="text-5xl font-bold font-sans text-white">{price}</span>
      <span className="font-mono text-sm text-text-secondary/70 shrink-0">{period}</span>
    </div>
    <p className="mt-4 font-mono text-xs text-text-secondary/80 leading-relaxed min-h-[40px]">
      {description}
    </p>
  </div>
);

interface FeaturesListProps {
  features: Array<string | { name: string; included?: boolean }>;
  recommended?: boolean;
}

const FeaturesList = ({ features, recommended }: FeaturesListProps) => (
  <ul className="space-y-4 mb-8">
    {features.map(feature => {
      const featureName = typeof feature === 'string' ? feature : feature.name;
      const key = typeof feature === 'string' ? feature : feature.name;
      return (
        <li
          key={key}
          className="flex items-start gap-3 font-mono text-sm text-text-secondary group-hover:text-white transition-colors"
        >
          <Check
            size={16}
            className={`shrink-0 mt-0.5 ${
              recommended
                ? 'text-brand-accent'
                : 'text-text-secondary group-hover:text-brand-primary'
            }`}
          />
          <span>{featureName}</span>
        </li>
      );
    })}
  </ul>
);

interface CTAButtonProps {
  text: string;
  recommended?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const CTAButton = ({ text, recommended, onClick, disabled }: CTAButtonProps) => {
  if (recommended) {
    return (
      <Button variant="primary" fullWidth className="py-4" onClick={onClick} disabled={disabled}>
        {text} &gt;
      </Button>
    );
  }

  return (
    <Button variant="secondary" fullWidth className="py-4" onClick={onClick} disabled={disabled}>
      {text} &gt;
    </Button>
  );
};

PricingCard.displayName = 'PricingCard';
