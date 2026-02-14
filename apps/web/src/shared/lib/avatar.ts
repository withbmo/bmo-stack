import { API_BASE } from '../lib/client';
import { env } from '@/env';

function getUploadsBase(): string {
  if (API_BASE) return API_BASE;
  const dev = env.NEXT_PUBLIC_API_URL_DEV as string | undefined;
  const prod = env.NEXT_PUBLIC_API_URL_PROD as string | undefined;
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && dev)
    return dev.replace(/\/$/, '');
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production' && prod)
    return prod.replace(/\/$/, '');
  return 'http://localhost:3001';
}

export function resolveAvatarUrl(avatarUrl?: string | null): string | null {
  if (!avatarUrl) return null;
  if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
    return avatarUrl;
  }
  if (avatarUrl.startsWith('/')) {
    return `${getUploadsBase()}${avatarUrl}`;
  }
  return avatarUrl;
}
