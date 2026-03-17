import { useEffect, useState } from 'react';

import { getEnabledOAuthProviders, type OAuthProvider } from '@/shared/lib/auth';

type UseOAuthProvidersResult = {
  providers: OAuthProvider[];
  isLoading: boolean;
};

export function useOAuthProviders(): UseOAuthProvidersResult {
  const [providers, setProviders] = useState<OAuthProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadProviders = async () => {
      try {
        const enabled = await getEnabledOAuthProviders();
        if (!cancelled) {
          setProviders(enabled);
        }
      } catch {
        if (!cancelled) {
          setProviders([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadProviders();

    return () => {
      cancelled = true;
    };
  }, []);

  return { providers, isLoading };
}
