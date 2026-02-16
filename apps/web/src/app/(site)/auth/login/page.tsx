'use client';

import { Suspense } from 'react';

import { LoginRoute } from '@/site/routes/auth';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-nexus-black" />}>
      <LoginRoute />
    </Suspense>
  );
}
