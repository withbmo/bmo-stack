'use client';

import type { UserProfile } from '@pytholit/contracts';
import { usePathname } from 'next/navigation';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

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
  const pathname = usePathname() ?? '/';

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
    const isProtectedRoute =
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/editor') ||
      pathname.startsWith('/admin');

    // Avoid noisy `/users/me -> 401` calls on public pages.
    // We only hydrate the session when the user enters a protected area.
    if (!isProtectedRoute) {
      setHydrated(true);
      return;
    }

    if (user) {
      setHydrated(true);
      return;
    }

    setHydrated(false);
    void refreshSession();
  }, [pathname, refreshSession, user]);

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
