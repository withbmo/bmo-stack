import { Loader2 } from 'lucide-react';
import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  forwardRef,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react';

import { cn } from '../utils/cn';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-5 py-1.5 font-mono text-sm font-bold',
  md: 'px-6 py-2 font-mono text-base font-bold',
  lg: 'h-12 px-8 font-mono font-bold text-lg',
  xl: 'px-12 py-3 font-mono font-bold text-xl',
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

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

type ButtonAsButtonProps = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'size'> & {
    /** When omitted, renders a native button */
    to?: undefined;
  };

type ButtonAsAnchorProps = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'> & {
    /** When set, renders an anchor with the same visual styles */
    to: string;
    disabled?: boolean;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) {
    const to = 'to' in props ? props.to : undefined;
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
        const { to: _to, ...anchorProps } = props as ButtonAsAnchorProps;
        void _to;
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
              {...anchorProps}
            >
              {content}
            </a>
          </div>
        );
      }

      const { type = 'button', ...buttonProps } = props as ButtonAsButtonProps;
      return (
        <div className={wrapperClass}>
          <span className="nexus-shadow-btn-back" aria-hidden />
          <button
            ref={ref as Ref<HTMLButtonElement>}
            type={type}
            disabled={isDisabled}
            className={innerClassName}
            {...buttonProps}
          >
            {content}
          </button>
        </div>
      );
    }

    if (to != null) {
      const { to: _to, ...anchorProps } = props as ButtonAsAnchorProps;
      void _to;
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
          {...anchorProps}
        >
          {content}
        </a>
      );
    }

    const { type = 'button', ...buttonProps } = props as ButtonAsButtonProps;

    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type={type}
        disabled={isDisabled}
        className={innerClassName}
        {...buttonProps}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
