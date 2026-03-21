'use client';

import { MotionFade, MotionSlideIn, MotionStagger } from '@/ui';
import { Badge } from '@/ui/shadcn/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/shadcn/ui/card';
import { Separator } from '@/ui/shadcn/ui/separator';
import { ArrowUpRight, MessageSquare, Rocket, Zap } from 'lucide-react';

import { WORKFLOW_STEPS } from '@/site/data/home';

const ICONS: Record<string, typeof MessageSquare> = {
  message: MessageSquare,
  zap: Zap,
  rocket: Rocket,
};

/**
 * Workflow section showing the build-to-deploy loop.
 */
export const WorkflowSection = () => {
  return (
    <MotionFade as="section" className="border-b bg-transparent">
      <div className="w-full px-6 py-16 md:py-20">
        <MotionSlideIn as="div" className="mb-8 space-y-3">
          <Badge variant="outline">
            <Rocket className="size-3" />
            Workflow
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            From prompt to production.
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            A clean loop for teams shipping backend services daily.
          </p>
          <Separator />
        </MotionSlideIn>

        <MotionStagger as="div" className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {WORKFLOW_STEPS.map((step, index) => {
            const Icon = ICONS[step.icon] ?? MessageSquare;
            return (
              <MotionFade key={step.id}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="inline-flex size-8 items-center justify-center rounded-md border bg-muted text-foreground">
                        <Icon className="size-4" />
                      </div>
                      <span className="text-xs text-muted-foreground">0{index + 1}</span>
                    </div>
                    <CardTitle>{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{step.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="justify-between">
                    <span className="text-xs text-muted-foreground">{step.meta}</span>
                    <ArrowUpRight className="size-4 text-muted-foreground" />
                  </CardFooter>
                </Card>
              </MotionFade>
            );
          })}
        </MotionStagger>
      </div>
    </MotionFade>
  );
};
