import { useState, useCallback } from 'react';
import { OTP_CONFIG } from '@/shared/constants';
import { useServerTimer } from '@/shared/hooks/useServerTimer';

type OtpFlowType = 'login' | 'signup';

interface OtpFlowState {
  type: OtpFlowType;
  email: string;
  expiresAt: string | null;
  nextRequestAt: string | null;
}

interface UseOtpFlowOptions {
  /** Current flow type (login or signup) */
  flowType: OtpFlowType;
  /** Callback when OTP verification succeeds */
  onSuccess?: (token: string) => void;
}

interface UseOtpFlowReturn {
  /** Whether OTP has been sent */
  otpSent: boolean;
  /** Email address for OTP flow (for signup pending verification) */
  pendingEmail: string | null;
  /** Current OTP code input */
  otpCode: string;
  /** Set OTP code input */
  setOtpCode: (code: string) => void;
  /** Seconds until resend is allowed */
  resendSecondsLeft: number;
  /** Whether resend is on cooldown */
  canResend: boolean;
  /** Mark OTP as sent and start cooldown */
  markOtpSent: (email: string, expiresAt?: string | null, nextRequestAt?: string | null) => void;
  /** Handle successful OTP send (for resend) */
  handleResendSuccess: (expiresAt?: string | null, nextRequestAt?: string | null) => void;
  /** Clear the OTP flow state */
  clearFlow: () => void;
  /** Reset just the OTP input */
  resetOtpInput: () => void;
}

// Session storage helpers
function saveOtpFlow(state: OtpFlowState): void {
  try {
    sessionStorage.setItem(OTP_CONFIG.STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

function loadOtpFlow(): OtpFlowState | null {
  try {
    const raw = sessionStorage.getItem(OTP_CONFIG.STORAGE_KEY);
    if (!raw) return null;

    const state = JSON.parse(raw) as OtpFlowState;
    const expiresMs = state.expiresAt ? Date.parse(state.expiresAt) : null;
    if (expiresMs && Date.now() > expiresMs) {
      clearOtpFlowStorage();
      return null;
    }

    return state;
  } catch {
    return null;
  }
}

function clearOtpFlowStorage(): void {
  try {
    sessionStorage.removeItem(OTP_CONFIG.STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

function calculateFallbackNextRequestAt(): string {
  return new Date(Date.now() + OTP_CONFIG.RESEND_COOLDOWN_SECONDS * 1000).toISOString();
}

// Helper to get initial state from storage
function getInitialOtpState(flowType: OtpFlowType): {
  otpSent: boolean;
  pendingEmail: string | null;
  nextRequestAt: string | null;
  expiresAt: string | null;
} {
  const savedFlow = loadOtpFlow();

  if (!savedFlow || savedFlow.type !== flowType) {
    if (savedFlow && savedFlow.type !== flowType) {
      clearOtpFlowStorage();
    }
    return {
      otpSent: false,
      pendingEmail: null,
      nextRequestAt: null,
      expiresAt: null,
    };
  }

  if (flowType === 'signup') {
    return {
      otpSent: false,
      pendingEmail: savedFlow.email,
      nextRequestAt: savedFlow.nextRequestAt ?? null,
      expiresAt: savedFlow.expiresAt ?? null,
    };
  }

  return {
    otpSent: true,
    pendingEmail: null,
    nextRequestAt: savedFlow.nextRequestAt ?? null,
    expiresAt: savedFlow.expiresAt ?? null,
  };
}

/**
 * Hook for managing OTP verification flow
 * Handles session persistence, resend cooldowns, and state management
 */
export function useOtpFlow({ flowType }: UseOtpFlowOptions): UseOtpFlowReturn {
  // Use lazy initialization to restore state from storage
  const [initialState] = useState(() => getInitialOtpState(flowType));
  const [otpSent, setOtpSent] = useState(initialState.otpSent);
  const [pendingEmail, setPendingEmail] = useState<string | null>(initialState.pendingEmail);
  const [nextRequestAt, setNextRequestAt] = useState<string | null>(initialState.nextRequestAt);
  const [otpCode, setOtpCode] = useState('');
  const { secondsLeft: resendSecondsLeft } = useServerTimer(nextRequestAt);

  const canResend = resendSecondsLeft === 0;

  const markOtpSent = useCallback(
    (email: string, expiresAtOverride?: string | null, nextRequestAtOverride?: string | null) => {
      const nextAt = nextRequestAtOverride || calculateFallbackNextRequestAt();
      const expiresAtValue = expiresAtOverride ?? null;
      setOtpSent(true);

      if (flowType === 'signup') {
        setPendingEmail(email);
      }

      setNextRequestAt(nextAt);
      saveOtpFlow({
        type: flowType,
        email,
        expiresAt: expiresAtValue,
        nextRequestAt: nextAt,
      });
    },
    [flowType]
  );

  const handleResendSuccess = useCallback(
    (expiresAtOverride?: string | null, nextRequestAtOverride?: string | null) => {
      const nextAt = nextRequestAtOverride || calculateFallbackNextRequestAt();
      const expiresAtValue = expiresAtOverride ?? null;
      const currentEmail = pendingEmail || '';
      setNextRequestAt(nextAt);
      if (currentEmail) {
        saveOtpFlow({
          type: flowType,
          email: currentEmail,
          expiresAt: expiresAtValue,
          nextRequestAt: nextAt,
        });
      }
    },
    [flowType, pendingEmail]
  );

  const clearFlow = useCallback(() => {
    setOtpSent(false);
    setPendingEmail(null);
    setOtpCode('');
    setNextRequestAt(null);
    clearOtpFlowStorage();
  }, []);

  const resetOtpInput = useCallback(() => {
    setOtpCode('');
  }, []);

  // Handle OTP code input with validation
  const handleSetOtpCode = useCallback((code: string) => {
    // Only allow digits, max length
    const sanitized = code.replace(/\D/g, '').slice(0, OTP_CONFIG.CODE_MAX_LENGTH);
    setOtpCode(sanitized);
  }, []);

  return {
    otpSent,
    pendingEmail,
    otpCode,
    setOtpCode: handleSetOtpCode,
    resendSecondsLeft,
    canResend,
    markOtpSent,
    handleResendSuccess,
    clearFlow,
    resetOtpInput,
  };
}
