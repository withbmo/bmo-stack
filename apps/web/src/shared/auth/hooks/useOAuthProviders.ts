import { useEffect, useState } from 'react';

import { getEnabledOAuthProviders, type OAuthProvider } from '@/shared/lib/auth';

type UseOAuthProvidersResult = {
  providers: OAuthProvider[] | null;
  isLoading: boolean;
};

/**
 * Loads enabled OAuth providers for auth screens.
 * Returns null while loading, then a concrete provider array (possibly empty).
 */
export function useOAuthProviders(): UseOAuthProvidersResult {
  const [providers, setProviders] = useState<OAuthProvider[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    void getEnabledOAuthProviders()
      .then((nextProviders) => {
        if (!cancelled) setProviders(nextProviders);
      })
      .catch(() => {
        if (!cancelled) setProviders([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    providers,
    isLoading: providers === null,
  };
}
