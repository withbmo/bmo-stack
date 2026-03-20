'use client';

import {
  type ExternalToast,
  toast as sonnerToast,
  Toaster as SonnerToaster,
  type ToasterProps as SonnerToasterProps,
} from 'sonner';

export type ToastOptions = ExternalToast;
export type ToastId = string | number;

export interface ToastApi {
  dismiss: (id?: ToastId) => void;
  error: (message: string, options?: ToastOptions) => ToastId;
  info: (message: string, options?: ToastOptions) => ToastId;
  message: (message: string, options?: ToastOptions) => ToastId;
  success: (message: string, options?: ToastOptions) => ToastId;
  warning: (message: string, options?: ToastOptions) => ToastId;
}

export const toast: ToastApi = {
  dismiss: id => {
    sonnerToast.dismiss(id);
  },
  error: (message, options) => sonnerToast.error(message, options),
  info: (message, options) => sonnerToast.info(message, options),
  message: (message, options) => sonnerToast(message, options),
  success: (message, options) => sonnerToast.success(message, options),
  warning: (message, options) => sonnerToast.warning(message, options),
};

export interface ToasterProps extends SonnerToasterProps {}

export const Toaster = (props: ToasterProps) => (
  <SonnerToaster
    position="top-right"
    richColors
    toastOptions={{
      classNames: {
        actionButton: '!bg-brand-primary !text-white',
        cancelButton: '!bg-bg-panel !text-text-primary',
        closeButton: '!border-border-default !bg-bg-panel !text-text-secondary',
        content: '!font-mono',
        description: '!text-text-secondary',
        error: '!border-state-error/40 !bg-bg-panel !text-state-error',
        info: '!border-state-info/40 !bg-bg-panel !text-state-info',
        loading: '!border-border-default !bg-bg-panel !text-text-primary',
        success: '!border-state-success/40 !bg-bg-panel !text-state-success',
        toast:
          '!border !border-border-default !bg-bg-panel !text-text-primary !shadow-[var(--shadow-panel)]',
        warning: '!border-state-warning/40 !bg-bg-panel !text-state-warning',
      },
    }}
    {...props}
  />
);
