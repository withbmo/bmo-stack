'use client';

import { Suspense } from 'react';

import { CallbackRoute } from '@/site/routes/auth';

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-app" />}>
      <CallbackRoute />
    </Suspense>
  );
}
