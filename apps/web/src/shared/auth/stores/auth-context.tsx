'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { UserProfile } from '@pytholit/contracts';

import { logout as apiLogout } from '@/shared/lib/auth';
import { getCurrentUser } from '@/shared/lib/user';

type AuthContextValue = {
  user: UserProfile | null;
  hydrated: boolean;
  isAuthenticated: boolean;
  refreshSession: () => Promise<UserProfile | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const refreshSession = useCallback(async (): Promise<UserProfile | null> => {
    try {
      const me = await getCurrentUser();
      setUser(me);
      return me;
    } catch {
      setUser(null);
      return null;
    } finally {
      setHydrated(true);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // ignore
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const value = useMemo(
    () => ({
      user,
      hydrated,
      isAuthenticated: !!user,
      refreshSession,
      logout,
    }),
    [user, hydrated, refreshSession, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

