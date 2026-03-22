import { env } from '@/env';

const TURNSTILE_TEST_SITEKEY_ALWAYS_PASS = '1x00000000000000000000AA';
const IS_PROD = process.env.NODE_ENV === 'production';

export function getTurnstileSiteKey(): string {
  const configured = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

  if (configured) {
    return configured;
  }

  if (!IS_PROD) {
    return TURNSTILE_TEST_SITEKEY_ALWAYS_PASS;
  }

  return '';
}

export function shouldUseTurnstile(): boolean {
  return Boolean(getTurnstileSiteKey());
}

