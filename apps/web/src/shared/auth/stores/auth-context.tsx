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
  useRef,
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
  const initialSessionCheckDone = useRef(false);
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
    if (user) {
      setHydrated(true);
      return;
    }

    // On first load, only check session for protected/auth routes.
    // Public pages default hydrated=true (no 401 noise, button defaults to "START BUILDING").
    if (!initialSessionCheckDone.current) {
      initialSessionCheckDone.current = true;
      if (isProtectedRoute) {
        setHydrated(false);
        void refreshSession();
        return;
      }
      setHydrated(true);
      return;
    }

    // Avoid noisy `/users/me -> 401` calls on every public navigation.
    // Protected routes still force refresh to enforce access correctly.
    if (isProtectedRoute) {
      setHydrated(false);
      void refreshSession();
      return;
    }

    setHydrated(true);
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
