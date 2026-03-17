import { AUTH_CONSTANTS } from '@pytholit/validation';
import { useCallback, useState } from "react";

type AuthMode = "login" | "register";

interface UseAuthFormOptions {
  /** Initial auth mode */
  mode: AuthMode;
}

/** Username allowed: 3–30 chars, only a–z, A–Z, 0–9, _ */
export const USERNAME_REGEX = AUTH_CONSTANTS.USERNAME_REGEX;

interface UseAuthFormReturn {
  // Form fields
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  username: string;
  setUsername: (username: string) => void;
  firstName: string;
  setFirstName: (name: string) => void;
  lastName: string;
  setLastName: (name: string) => void;

  // Validation state
  passwordMismatch: boolean;
  setPasswordMismatch: (mismatch: boolean) => void;
  fieldErrors: Record<string, string>;
  setFieldErrors: (errors: Record<string, string>) => void;

  // UI state
  error: string | null;
  setError: (error: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Validation helpers
  validatePasswords: () => boolean;
  validateSignupFields: () => boolean;
  clearError: () => void;
  resetForm: () => void;
}

/**
 * Hook for managing auth form state
 * Handles form fields, validation, and loading states
 */
export function useAuthForm({ mode }: UseAuthFormOptions): UseAuthFormReturn {
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Validation
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validatePasswords = useCallback(() => {
    if (mode === "register" && password !== confirmPassword) {
      setPasswordMismatch(true);
      return false;
    }
    setPasswordMismatch(false);
    return true;
  }, [mode, password, confirmPassword]);

  const validateSignupFields = useCallback(() => {
    if (mode !== "register") return true;
    const errors: Record<string, string> = {};
    const u = username.trim();
    if (!u) {
      errors.username = "Username is required.";
    } else if (!USERNAME_REGEX.test(u)) {
      errors.username =
        "Username must be 3-39 chars, letters/numbers/hyphens only, no leading/trailing hyphen.";
    }
    if (!firstName.trim()) {
      errors.firstName = "First name is required.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [mode, username, firstName]);

  const clearError = useCallback(() => {
    setError(null);
    setFieldErrors({});
  }, []);

  const resetForm = useCallback(() => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsername("");
    setFirstName("");
    setLastName("");
    setPasswordMismatch(false);
    setFieldErrors({});
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    username,
    setUsername,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    passwordMismatch,
    setPasswordMismatch,
    fieldErrors,
    setFieldErrors,
    error,
    setError,
    isLoading,
    setIsLoading,
    validatePasswords,
    validateSignupFields,
    clearError,
    resetForm,
  };
}
