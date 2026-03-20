import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
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

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, variant = 'default', padding, ...props }, ref) => {
    const effectivePadding = padding ?? 'md';
    return (
      <div
        ref={ref}
        className={cn(
          'border border-border-dim transition-all shadow-[var(--shadow-subtle)]',
          variants[variant],
          paddings[effectivePadding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
