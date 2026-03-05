import { type OAuthProvider } from '@/shared/lib/auth';

type UseOAuthProvidersResult = {
  providers: OAuthProvider[];
  isLoading: boolean;
};

const DEFAULT_OAUTH_PROVIDERS: OAuthProvider[] = ['github', 'google'];

/**
 * Returns static OAuth providers for auth screens.
 * Provider gating is enforced server-side during sign-in.
 */
export function useOAuthProviders(): UseOAuthProvidersResult {
  return {
    providers: DEFAULT_OAUTH_PROVIDERS,
    isLoading: false,
  };
}
