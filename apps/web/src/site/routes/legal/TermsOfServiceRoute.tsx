'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { MotionFade, MotionSlideIn } from '@/ui';
import { Button } from '@/ui/shadcn/ui/button';
import { Separator } from '@/ui/shadcn/ui/separator';

export function TermsOfServiceRoute() {
  const router = useRouter();

  return (
    <MotionFade as="main" className="rail-borders mx-auto w-full max-w-5xl px-6 py-10 md:py-12">
      <MotionSlideIn as="div" className="mb-10 flex items-center">
        <Button variant="ghost" className="-ml-3 gap-1 text-muted-foreground hover:text-foreground" onClick={() => router.back()}>
          <ArrowLeft />
          Back
        </Button>
      </MotionSlideIn>

      <MotionSlideIn as="div" delay={0.04} className="mx-auto max-w-4xl space-y-8">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: March 20, 2026</p>

        <Separator />

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
          <p className="leading-7 text-muted-foreground">
            By accessing and using this website, you agree to be bound by these terms and any
            applicable service-specific guidelines.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">2. User License</h2>
          <p className="leading-7 text-muted-foreground">
            Permission is granted to temporarily view one copy of the materials for personal,
            non-commercial use. This is a license grant, not a title transfer.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">3. Disclaimer</h2>
          <p className="leading-7 text-muted-foreground">
            Materials are provided on an &quot;as is&quot; basis without warranties of any kind,
            express or implied, including merchantability, fitness for purpose, or non-infringement.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">4. Limitations</h2>
          <p className="leading-7 text-muted-foreground">
            In no event will we or our suppliers be liable for damages arising from use or inability
            to use the materials, including loss of data, profit, or business interruption.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">5. Revisions and Errata</h2>
          <p className="leading-7 text-muted-foreground">
            Materials may include technical or typographical errors. We do not warrant that all
            content is accurate, complete, or current.
          </p>
        </section>
      </MotionSlideIn>
    </MotionFade>
  );
}
