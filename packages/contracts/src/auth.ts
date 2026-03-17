export interface PasswordStrengthResponse {
  score: number; // 0-4
  label: string; // "Too Weak", "Weak", "Fair", "Strong", "Very Strong"
  crackTime: string; // Human-readable crack time estimate
  feedback: string[]; // Actionable suggestions
  isStrong: boolean; // true if score >= 3
}

export type OAuthProvider = 'google' | 'github';

export interface EnabledOAuthProvidersResponse {
  providers: OAuthProvider[];
}

export interface OAuthOnboardingStatusResponse {
  required: boolean;
  completedAt: string | null;
}
