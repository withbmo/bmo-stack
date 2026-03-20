import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { Children, cloneElement, forwardRef, isValidElement } from 'react';

import { cn } from '../../utils/cn';

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  htmlFor?: string;
  required?: boolean;
  descriptionId?: string;
  children: ReactNode;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(function FormField(
  {
    label,
    hint,
    error,
    htmlFor,
    required,
    descriptionId,
    className,
    children,
    ...props
  },
  ref
) {
  const resolvedDescriptionId =
    descriptionId ?? (htmlFor && (hint || error) ? `${htmlFor}-description` : undefined);

  const enhancedChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;

    const childElement = child as ReactElement<Record<string, unknown>>;
    const nextProps: Record<string, unknown> = {};

    if (resolvedDescriptionId && childElement.props['aria-describedby'] == null) {
      nextProps['aria-describedby'] = resolvedDescriptionId;
    }

    if (error && childElement.props['aria-invalid'] == null) {
      nextProps['aria-invalid'] = true;
    }

    return cloneElement(childElement, nextProps);
  });

  return (
    <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="font-mono text-xs font-semibold uppercase tracking-wider text-text-secondary"
        >
          {label}
          {required ? <span className="ml-1 text-brand-primary">*</span> : null}
        </label>
      )}

      {enhancedChildren}

      {(error || hint) && (
        <p
          id={resolvedDescriptionId}
          className={cn('font-mono text-xs', error ? 'text-state-error' : 'text-text-secondary')}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';
