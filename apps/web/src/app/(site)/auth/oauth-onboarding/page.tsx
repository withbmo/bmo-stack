'use client';

import { Suspense } from 'react';

import { OAuthOnboardingRoute } from '@/site/routes/auth';

export default function OAuthOnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-app" />}>
      <OAuthOnboardingRoute />
    </Suspense>
  );
}
