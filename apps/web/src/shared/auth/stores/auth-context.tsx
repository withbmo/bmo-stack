import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AUTH_STORAGE } from '@/shared/constants';

type AuthContextValue = {
  token: string | null;
  setToken: (t: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
  hydrated: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(AUTH_STORAGE.ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Important for Next.js hydration:
  // - Server render cannot read localStorage (token is always null on the server)
  // - If we read localStorage during the initial client render, the first client tree can differ
  //   from the server HTML, triggering a hydration mismatch.
  // So: initialize as null and hydrate from storage after mount.
  const [token, setTokenState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const setToken = useCallback((t: string | null) => {
    setTokenState(t);
    try {
      if (t) localStorage.setItem(AUTH_STORAGE.ACCESS_TOKEN_KEY, t);
      else localStorage.removeItem(AUTH_STORAGE.ACCESS_TOKEN_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  // Initial client-side hydration from localStorage
  useEffect(() => {
    setTokenState(readStoredToken());
    setHydrated(true);
  }, []);

  // Sync auth state when another tab logs in/out (e.g. logout in another tab)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === AUTH_STORAGE.ACCESS_TOKEN_KEY) {
        setTokenState(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const logout = useCallback(() => setToken(null), [setToken]);

  const value = useMemo(
    () => ({
      token,
      setToken,
      isAuthenticated: !!token,
      logout,
      hydrated,
    }),
    [token, setToken, logout, hydrated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
