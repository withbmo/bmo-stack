'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

import { MotionBackdrop, MotionScaleIn } from '../../motion';
import { cn } from '../../utils/cn';

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Optional title displayed in the header */
  title?: string;
  /** Modal content */
  children: ReactNode;
  /** Size variant */
  variant?: 'default' | 'wide' | 'fullscreen';
  /** Disable close when loading/submitting */
  isLoading?: boolean;
  /** Additional className for the panel */
  className?: string;
}

const variants = {
  default: 'w-full max-w-md',
  wide: 'w-full max-w-2xl',
  fullscreen: 'w-full max-w-6xl h-[90vh]',
};

/**
 * Modal built on top of `@radix-ui/react-dialog`.
 *
 * Radix handles:
 * - Focus trapping inside the modal
 * - Closing on `Escape` key press
 * - Proper ARIA roles (`role="dialog"`, `aria-modal`, `aria-labelledby`)
 * - Scroll-lock on `<body>` while open
 * - Portal rendering to `document.body`
 *
 * The `isLoading` prop prevents dismissal via backdrop click and the close button.
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  variant = 'default',
  isLoading = false,
  className,
}: ModalProps) => {
  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      onClose();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay asChild>
          <MotionBackdrop className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm" />
        </Dialog.Overlay>

        {/* Panel */}
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
          <Dialog.Content asChild>
            <MotionScaleIn
              className={cn(
                'relative bg-bg-panel border border-border-dim shadow-[0_0_60px_-10px_rgba(109,40,217,0.4)] p-6 pointer-events-auto',
                variants[variant],
                className
              )}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                {title && (
                  <Dialog.Title className="font-mono text-xs font-bold text-brand-primary tracking-widest uppercase">
                    {title}
                  </Dialog.Title>
                )}

                <Dialog.Close asChild>
                  <button
                    type="button"
                    disabled={isLoading}
                    className="ml-auto text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Close modal"
                  >
                    <X size={18} />
                  </button>
                </Dialog.Close>
              </div>

              {/* Body */}
              <div>{children}</div>
            </MotionScaleIn>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

Modal.displayName = 'Modal';
