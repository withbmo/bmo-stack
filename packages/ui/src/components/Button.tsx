import {
  forwardRef,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-5 py-2 font-mono text-sm font-bold',
  md: 'px-6 py-3 font-mono text-base font-bold',
  lg: 'h-14 px-8 font-mono font-bold text-lg',
  xl: 'px-12 py-4 font-mono font-bold text-xl',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'nexus-shadow-btn flex items-center justify-center gap-2 bg-brand-primary text-white border border-white/30 uppercase tracking-wider',
  secondary:
    'inline-flex items-center justify-center gap-2 bg-black/40 backdrop-blur text-white font-mono border-2 border-border-dim hover:border-brand-primary hover:text-brand-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border-dim disabled:hover:text-white',
  ghost:
    'inline-flex items-center justify-center gap-2 bg-transparent text-text-secondary hover:text-white hover:bg-white/5 font-mono transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-text-secondary disabled:hover:bg-transparent',
  danger:
    'inline-flex items-center justify-center gap-2 font-mono border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-red-500',
};

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  /** When set, renders as a React Router Link (same visual styles) */
  to?: string;
  fullWidth?: boolean;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      to,
      fullWidth = false,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) {
    const isDisabled = disabled ?? isLoading;
    const sizeClass = sizeClasses[size];
    const widthClass = fullWidth ? 'w-full min-w-0' : '';

    const innerClassName = cn(sizeClass, widthClass, variantClasses[variant], className);

    const content = (
      <>
        {isLoading && <Loader2 className="animate-spin shrink-0" size={16} />}
        {children}
      </>
    );

    if (variant === 'primary') {
      const wrapperClass = fullWidth
        ? 'nexus-shadow-btn-wrapper block w-full'
        : 'nexus-shadow-btn-wrapper inline-block';
      if (to != null) {
        const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
          if (isDisabled) {
            event.preventDefault();
          }
        };

        return (
          <div className={wrapperClass}>
            <span className="nexus-shadow-btn-back" aria-hidden />
            <a
              ref={ref as Ref<HTMLAnchorElement>}
              href={to}
              onClick={onClick}
              className={cn(
                innerClassName,
                'inline-flex',
                isDisabled && 'opacity-60 pointer-events-none'
              )}
              aria-disabled={isDisabled}
            >
              {content}
            </a>
          </div>
        );
      }
      return (
        <div className={wrapperClass}>
          <span className="nexus-shadow-btn-back" aria-hidden />
          <button
            ref={ref as Ref<HTMLButtonElement>}
            type={type}
            disabled={isDisabled}
            className={innerClassName}
            {...props}
          >
            {content}
          </button>
        </div>
      );
    }

    if (to != null) {
      const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
        if (isDisabled) {
          event.preventDefault();
        }
      };

      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          href={to}
          onClick={onClick}
          className={cn(innerClassName, isDisabled && 'opacity-60 pointer-events-none')}
          aria-disabled={isDisabled}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type={type}
        disabled={isDisabled}
        className={innerClassName}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
