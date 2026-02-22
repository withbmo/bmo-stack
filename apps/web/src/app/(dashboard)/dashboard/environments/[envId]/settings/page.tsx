'use client';

import { useParams } from 'next/navigation';

import { EnvironmentSettingsRoute } from '@/dashboard/features/environments';

export default function EnvironmentSettingsPage() {
  const params = useParams();
  const raw = params.envId;
  const envId = Array.isArray(raw) ? raw[0] : raw;

  if (!envId) {
    return null;
  }

  return <EnvironmentSettingsRoute envId={envId} />;
}
