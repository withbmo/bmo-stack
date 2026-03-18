import { Suspense } from 'react';

import { OAuthOnboardingRoute } from '@/site/routes/auth';

export default function OAuthOnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OAuthOnboardingRoute />
    </Suspense>
  );
}
