'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { MotionFade, MotionSlideIn } from '@/ui';
import { Button } from '@/ui/shadcn/ui/button';
import { Separator } from '@/ui/shadcn/ui/separator';

export function PrivacyPolicyRoute() {
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
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: March 20, 2026</p>

        <Separator />

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
          <p className="leading-7 text-muted-foreground">
            We collect information you provide directly to us. For example, we collect information
            when you create an account, subscribe to our newsletter, fill out forms, request
            support, or otherwise communicate with us.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
          <p className="leading-7 text-muted-foreground">
            We use collected information to provide, maintain, and improve our services, administer
            your account, process transactions, and send relevant updates.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">3. Information Sharing</h2>
          <p className="leading-7 text-muted-foreground">
            We may share information with vendors, consultants, and service providers who require
            access to perform work on our behalf, as described in this policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">4. Data Security</h2>
          <p className="leading-7 text-muted-foreground">
            We take reasonable measures to protect your information from loss, misuse,
            unauthorized access, disclosure, alteration, and destruction.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">5. Contact Us</h2>
          <p className="leading-7 text-muted-foreground">
            For questions about this Privacy Policy, contact us at privacypytholit.com.
          </p>
        </section>
      </MotionSlideIn>
    </MotionFade>
  );
}
