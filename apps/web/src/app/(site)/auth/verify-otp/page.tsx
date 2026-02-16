'use client';

import { Suspense } from 'react';

import { VerifyOtpRoute } from '@/site/routes/auth';

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-nexus-black" />}>
      <VerifyOtpRoute />
    </Suspense>
  );
}
