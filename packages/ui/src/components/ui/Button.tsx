import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-mono transition-all disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-app',
  {
    variants: {
      variant: {
        primary:
          'offset-shadow-button bg-brand-primary text-white border border-white/30 uppercase tracking-wider',
        secondary:
          'bg-black/40 backdrop-blur text-white border-2 border-border-dim hover:border-brand-primary hover:text-brand-primary disabled:hover:border-border-dim disabled:hover:text-white',
        ghost:
          'bg-transparent text-text-secondary hover:text-white hover:bg-white/5 disabled:hover:text-text-secondary disabled:hover:bg-transparent',
        danger:
          'border border-state-error/50 text-state-error hover:bg-state-error hover:text-white disabled:hover:bg-transparent disabled:hover:text-state-error',
      },
      size: {
        sm: 'px-5 py-1.5 text-sm font-bold',
        md: 'px-6 py-2 text-base font-bold',
        lg: 'h-12 px-8 font-bold text-lg',
        xl: 'px-12 py-3 font-bold text-xl',
      },
      fullWidth: {
        true: 'w-full min-w-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, fullWidth, isLoading, asChild = false, children, ...props },
    ref
  ) => {
    const isPrimary = variant === 'primary' || variant === undefined;
    const { type = 'button', ...restProps } = props;

    const content = (
      <>
        {isLoading && <Loader2 className="animate-spin shrink-0" size={16} />}
        {children}
      </>
    );

    // Primary buttons use the shared offset-shadow wrapper treatment.
    if (isPrimary && !asChild) {
      const wrapperClass = fullWidth
        ? 'offset-shadow-button-wrapper block w-full'
        : 'offset-shadow-button-wrapper inline-block';

      return (
        <div className={wrapperClass}>
          <button
            ref={ref}
            type={type}
            className={cn(buttonVariants({ variant, size, fullWidth, className }))}
            disabled={restProps.disabled || isLoading}
            aria-busy={isLoading || undefined}
            data-loading={isLoading ? '' : undefined}
            {...restProps}
          >
            {content}
          </button>
        </div>
      );
    }

    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(buttonVariants({ variant, size, fullWidth, className }))}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={restProps.disabled || isLoading}
        aria-busy={isLoading || undefined}
        data-loading={isLoading ? '' : undefined}
        {...restProps}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
