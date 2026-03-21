import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const sonnerMock = vi.hoisted(() => {
  const dismiss = vi.fn();
  const error = vi.fn();
  const info = vi.fn();
  const success = vi.fn();
  const warning = vi.fn();
  const message = vi.fn();
  const Toaster = vi.fn(() => null);

  const toast = Object.assign(message, {
    dismiss,
    error,
    info,
    success,
    warning,
  });

  return { Toaster, dismiss, error, info, message, success, toast, warning };
});

vi.mock('sonner', () => ({
  Toaster: sonnerMock.Toaster,
  toast: sonnerMock.toast,
}));

import { toast,Toaster } from './Toast';

describe('toast', () => {
  it('forwards message and variant helpers to sonner', () => {
    toast.message('Saved');
    toast.success('Completed');
    toast.error('Failed');
    toast.info('Heads up');
    toast.warning('Careful');
    toast.dismiss('toast-1');

    expect(sonnerMock.message).toHaveBeenCalledWith('Saved', undefined);
    expect(sonnerMock.success).toHaveBeenCalledWith('Completed', undefined);
    expect(sonnerMock.error).toHaveBeenCalledWith('Failed', undefined);
    expect(sonnerMock.info).toHaveBeenCalledWith('Heads up', undefined);
    expect(sonnerMock.warning).toHaveBeenCalledWith('Careful', undefined);
    expect(sonnerMock.dismiss).toHaveBeenCalledWith('toast-1');
  });

  it('renders the package toaster with pytholit defaults', () => {
    render(<Toaster />);

    expect(sonnerMock.Toaster).toHaveBeenCalled();
    expect(sonnerMock.Toaster).toHaveBeenCalledWith(
      expect.objectContaining({
        position: 'top-right',
        richColors: true,
        toastOptions: expect.objectContaining({
          classNames: expect.objectContaining({
            toast: expect.stringContaining('!bg-bg-panel'),
            success: expect.stringContaining('!text-state-success'),
            error: expect.stringContaining('!text-state-error'),
          }),
        }),
      }),
      undefined
    );
  });
});
