import { getWebAppEnv } from '@/shared/env/app-env';

function getUploadsBase(): string {
  const base = getWebAppEnv().uploadsBase;
  if (base && base.trim() !== '') return base;
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
