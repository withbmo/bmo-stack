import {
  forwardRef,
  type InputHTMLAttributes,
  type Ref,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "../utils/cn";

const baseClass =
  "w-full bg-bg-surface border border-border-dim p-3 font-mono text-sm text-text-primary focus:outline-none focus:border-border-highlight focus:ring-1 focus:ring-border-highlight transition-all placeholder:text-text-secondary disabled:opacity-70";

const errorClass = "border-red-500 focus:border-red-500 focus:ring-red-500";

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  /** When true, renders a textarea instead of an input */
  multiline?: boolean;
  /** Red border and focus ring (e.g. validation error) */
  error?: boolean;
  /** Rows for textarea when multiline is true */
  rows?: number;
};

export const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(function Input({ multiline, error, className, rows = 3, ...rest }, ref) {
  const combinedClass = cn(baseClass, error && errorClass, className);

  if (multiline) {
    const { type: _omit, ...textareaRest } = rest;
    void _omit; // omit type from textarea (invalid on textarea)
    return (
      <textarea
        ref={ref as Ref<HTMLTextAreaElement>}
        rows={rows}
        className={cn(combinedClass, "resize-none")}
        {...(textareaRest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    );
  }

  return (
    <input
      ref={ref as Ref<HTMLInputElement>}
      className={combinedClass}
      {...rest}
    />
  );
});

Input.displayName = "Input";
