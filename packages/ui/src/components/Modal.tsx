import type { ReactNode } from "react";
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../utils/cn";

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Optional title displayed at the top */
  title?: string;
  /** Modal content */
  children: ReactNode;
  /** Size variant */
  variant?: "default" | "wide" | "fullscreen";
  /** Disable close when loading/submitting */
  isLoading?: boolean;
  /** Additional className for the panel */
  className?: string;
}

const variants = {
  default: "w-full max-w-md",
  wide: "w-full max-w-2xl",
  fullscreen: "w-full max-w-6xl h-[90vh]",
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  variant = "default",
  isLoading = false,
  className,
}: ModalProps) => {
  // Close on ESC key
  useEffect(() => {
    if (!isOpen || isLoading) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isLoading, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => !isLoading && onClose()}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "relative bg-bg-panel border border-border-dim shadow-[0_0_60px_-10px_rgba(109,40,217,0.4)] p-6",
          variants[variant],
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-6">
          {title && (
            <span
              id="modal-title"
              className="font-mono text-xs font-bold text-brand-primary tracking-widest uppercase"
            >
              {title}
            </span>
          )}
          <button
            type="button"
            onClick={() => !isLoading && onClose()}
            disabled={isLoading}
            className="ml-auto text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

Modal.displayName = "Modal";
