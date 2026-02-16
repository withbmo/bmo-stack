'use client';

import { useParams } from 'next/navigation';

import { EnvironmentTerminalRoute } from '@/dashboard/features/environments/routes/EnvironmentTerminalRoute';

export default function EnvironmentTerminalPage() {
  const params = useParams();
  const raw = params.envId;
  const envId = Array.isArray(raw) ? raw[0] : raw;

  if (!envId) {
    return null;
  }

  return <EnvironmentTerminalRoute envId={envId} />;
}
