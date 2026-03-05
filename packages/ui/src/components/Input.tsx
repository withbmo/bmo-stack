import { forwardRef, type InputHTMLAttributes, type Ref, type TextareaHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type InputVariant = 'default' | 'panel' | 'ide' | 'terminal';
export type InputIntent = 'default' | 'brand' | 'danger';
export type InputSize = 'sm' | 'md' | 'lg';

const rootClass =
  'w-full min-w-0 font-mono transition-all placeholder:text-text-secondary disabled:opacity-70 disabled:cursor-not-allowed';

const sizeClasses: Record<InputSize, string> = {
  sm: 'px-3 py-2 text-xs',
  md: 'p-3 text-sm',
  lg: 'px-4 py-3 text-base',
};

const variantClasses: Record<InputVariant, string> = {
  default: 'bg-bg-surface border border-border-default text-text-primary',
  panel: 'bg-bg-panel border border-border-default text-white placeholder:text-nexus-muted',
  ide: 'bg-[#0D0D0D] border border-nexus-gray text-white placeholder:text-nexus-muted',
  terminal:
    'bg-transparent border-none px-0 py-0 text-white placeholder:text-nexus-muted focus:ring-0 focus:border-transparent',
};

const intentFocusClasses: Record<InputIntent, string> = {
  default: 'focus:border-border-highlight',
  brand: 'focus:border-brand-primary',
  danger: 'focus:border-red-500',
};

const errorClass = 'border-red-500 focus:border-red-500';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  /** When true, renders a textarea instead of an input */
  multiline?: boolean;
  /** Red border and focus ring (e.g. validation error) */
  error?: boolean;
  /** Rows for textarea when multiline is true */
  rows?: number;
  /** Visual surface style */
  variant?: InputVariant;
  /** Focus/active color intent */
  intent?: InputIntent;
  /** Size for padding/text */
  size?: InputSize;
};

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(function Input(
  {
    multiline,
    error,
    className,
    rows = 3,
    variant = 'default',
    intent = 'default',
    size = 'md',
    ...rest
  },
  ref
) {
  const isTerminal = variant === 'terminal';
  const focusIntent = error ? 'danger' : intent;

  const combinedClass = cn(
    rootClass,
    sizeClasses[size],
    variantClasses[variant],
    !isTerminal && 'focus:outline-none',
    !isTerminal && intentFocusClasses[focusIntent],
    error && errorClass,
    className
  );

  if (multiline) {
    const { type: _omit, ...textareaRest } = rest;
    void _omit; // omit type from textarea (invalid on textarea)
    return (
      <textarea
        ref={ref as Ref<HTMLTextAreaElement>}
        rows={rows}
        className={cn(combinedClass, 'resize-none')}
        {...(textareaRest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    );
  }

  return <input ref={ref as Ref<HTMLInputElement>} className={combinedClass} {...rest} />;
});

Input.displayName = 'Input';
