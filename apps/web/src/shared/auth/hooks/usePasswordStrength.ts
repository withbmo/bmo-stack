import type { PasswordStrengthResponse } from '@pytholit/contracts';
import { getPasswordStrength } from '@pytholit/validation';
import { useMemo } from 'react';

export function usePasswordStrength(password: string): PasswordStrengthResponse | null {
  return useMemo(() => {
    if (!password) return null;
    return getPasswordStrength(password);
  }, [password]);
}
