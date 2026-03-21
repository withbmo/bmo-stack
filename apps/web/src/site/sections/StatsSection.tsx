'use client';

import { MotionFade, MotionSlideIn, MotionStagger } from '@/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/shadcn/ui/card';
import { Separator } from '@/ui/shadcn/ui/separator';

import { STATS } from '@/site/data/home';

interface StatCardProps {
  label: string;
  value: string;
  detail?: string;
}

const StatCard = ({ label, value, detail }: StatCardProps) => (
  <Card className="h-full">
    <CardHeader className="space-y-2">
      <CardDescription className="text-xs uppercase tracking-wide">{label}</CardDescription>
      <CardTitle className="text-4xl md:text-5xl">{value}</CardTitle>
    </CardHeader>
    {detail && (
      <CardContent>
        <p className="text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    )}
  </Card>
);

/**
 * Statistics section displaying platform metrics (matches website design)
 */
export const StatsSection = () => {
  return (
    <MotionFade as="section" className="border-b bg-transparent">
      <div className="w-full px-6 py-16 md:py-20">
        <MotionSlideIn as="div" className="mb-8">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Platform by the numbers</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Built on reliable infrastructure and production-first defaults.
          </p>
          <Separator className="mt-4" />
        </MotionSlideIn>
        <MotionStagger as="div" className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STATS.map((stat, idx) => (
            <MotionFade key={idx}>
              <StatCard label={stat.label} value={stat.value} detail={stat.detail} />
            </MotionFade>
          ))}
        </MotionStagger>
      </div>
    </MotionFade>
  );
};
