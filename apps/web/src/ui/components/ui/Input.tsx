import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
  type TextareaHTMLAttributes,
} from 'react';

import { cn } from '../../utils/cn';

export type InputVariant = 'default' | 'panel' | 'ide' | 'terminal';
export type InputIntent = 'default' | 'brand' | 'danger';
export type InputSize = 'sm' | 'md' | 'lg';

const rootClass =
  'w-full min-w-0 font-mono transition-all placeholder:text-text-secondary disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none';

const sizeClasses: Record<InputSize, string> = {
  sm: 'px-3 py-2 text-xs',
  md: 'p-3 text-sm',
  lg: 'px-4 py-3 text-base',
};

const variantClasses: Record<InputVariant, string> = {
  default: 'bg-bg-surface border border-border-default text-text-primary',
  panel:
    'bg-bg-panel border border-border-default text-text-primary placeholder:text-text-secondary',
  ide: 'bg-bg-app border border-border-dim text-text-primary placeholder:text-text-secondary',
  terminal:
    'bg-transparent border-none px-0 py-0 text-text-primary placeholder:text-text-secondary focus:ring-0 focus:border-transparent',
};

const intentFocusClasses: Record<InputIntent, string> = {
  default:
    'focus:border-border-highlight focus-visible:ring-2 focus-visible:ring-border-highlight/30',
  brand: 'focus:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/30',
  danger: 'focus:border-state-error focus-visible:ring-2 focus-visible:ring-state-error/30',
};

const errorClass = 'border-state-error focus:border-state-error focus-visible:ring-state-error/30';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  /** When true, renders a textarea instead of an input */
  multiline?: boolean;
  /** Red border and focus ring (e.g. validation error) */
  error?: boolean;
  /** Error message displayed below the input */
  errorMessage?: ReactNode;
  /** Helper/hint text displayed below the input when there is no error */
  hint?: ReactNode;
  /** Label rendered above the input */
  label?: ReactNode;
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
    errorMessage,
    hint,
    label,
    className,
    rows = 3,
    variant = 'default',
    intent = 'default',
    size = 'md',
    id,
    ...rest
  },
  ref
) {
  const isTerminal = variant === 'terminal';
  const focusIntent = error ? 'danger' : intent;

  const fieldClass = cn(
    rootClass,
    sizeClasses[size],
    variantClasses[variant],
    !isTerminal && intentFocusClasses[focusIntent],
    error && errorClass,
    className
  );

  const field = multiline ? (
    (() => {
      const { type: _omit, ...textareaRest } = rest;
      void _omit; // omit type from textarea — invalid attribute on <textarea>
      return (
        <textarea
          id={id}
          ref={ref as Ref<HTMLTextAreaElement>}
          rows={rows}
          aria-invalid={error}
          aria-describedby={errorMessage || hint ? `${id}-description` : undefined}
          className={cn(fieldClass, 'resize-none')}
          {...(textareaRest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      );
    })()
  ) : (
    <input
      id={id}
      ref={ref as Ref<HTMLInputElement>}
      aria-invalid={error}
      aria-describedby={errorMessage || hint ? `${id}-description` : undefined}
      className={fieldClass}
      {...rest}
    />
  );

  // If there is no label/hint/errorMessage, return bare input for maximum flexibility
  if (!label && !hint && !errorMessage) {
    return field;
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="font-mono text-xs font-semibold text-text-secondary tracking-wider uppercase"
        >
          {label}
        </label>
      )}

      {field}

      {(errorMessage || hint) && (
        <p
          id={id ? `${id}-description` : undefined}
          className={cn(
            'font-mono text-xs',
            errorMessage ? 'text-state-error' : 'text-text-secondary'
          )}
        >
          {errorMessage ?? hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
