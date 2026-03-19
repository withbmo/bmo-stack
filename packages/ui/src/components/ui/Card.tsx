import type { ReactNode } from 'react';

import { cn } from '../../utils/cn';

export interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variants = {
  default: 'bg-bg-panel',
  glass: 'bg-bg-panel/90 backdrop-blur-md',
  interactive: 'bg-bg-panel hover:border-border-highlight cursor-pointer group',
};

const paddings = {
  none: '',
  sm: 'p-3',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = ({ children, className, variant = 'default', padding }: CardProps) => {
  const effectivePadding = padding ?? 'md';
  return (
    <div
      className={cn(
        'border border-border-dim transition-all',
        variants[variant],
        paddings[effectivePadding],
        className
      )}
    >
      {children}
    </div>
  );
};

Card.displayName = 'Card';
