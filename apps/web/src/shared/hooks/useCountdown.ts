import { useCallback,useEffect, useState } from 'react';

interface UseCountdownReturn {
  /** Seconds remaining */
  secondsLeft: number;
  /** Whether countdown is active */
  isActive: boolean;
  /** Start countdown from specified seconds */
  start: (seconds: number) => void;
  /** Reset countdown to 0 */
  reset: () => void;
}

/**
 * Hook for countdown timer functionality
 * Useful for OTP resend cooldowns, session timeouts, etc.
 */
export function useCountdown(): UseCountdownReturn {
  const [secondsLeft, setSecondsLeft] = useState(0);

  const isActive = secondsLeft > 0;

  const start = useCallback((seconds: number) => {
    setSecondsLeft(seconds);
  }, []);

  const reset = useCallback(() => {
    setSecondsLeft(0);
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  return { secondsLeft, isActive, start, reset };
}

/**
 * Format seconds as MM:SS string
 */
export function formatCountdown(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}
