'use client';

import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Github, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { DashboardPageHeader, PageLayout } from '@/dashboard/components/layout';
import { Badge } from '@/ui/shadcn/ui/badge';
import { Button } from '@/ui/shadcn/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/shadcn/ui/card';
import { Input } from '@/ui/shadcn/ui/input';
import { Label } from '@/ui/shadcn/ui/label';
import { Textarea } from '@/ui/shadcn/ui/textarea';

export const ContributeRoute = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resourceType, setResourceType] = useState<'readme' | 'skill'>('readme');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => router.push('/dashboard/hub'), 1600);
    }, 900);
  };

  if (isSuccess) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-xl">
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <CheckCircle2 className="size-12 text-green-500" />
              <h2 className="text-2xl font-semibold tracking-tight">Contribution submitted</h2>
              <p className="max-w-md text-muted-foreground">
                Thanks for contributing. We will review and publish your resource shortly.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl">
        <DashboardPageHeader
          badge={{ icon: Upload, label: 'Contribute' }}
          title="Share a resource"
          subtitle="Add a practical protocol or skill map for the community."
          actions={
            <Button variant="outline" onClick={() => router.push('/dashboard/hub')}>
              <ArrowLeft />
              Back to Hub
            </Button>
          }
        />

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Resource details</CardTitle>
              <CardDescription>Help others by documenting real implementation knowledge.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={resourceType === 'readme' ? 'default' : 'outline'}
                  onClick={() => setResourceType('readme')}
                >
                  Protocol
                </Button>
                <Button
                  type="button"
                  variant={resourceType === 'skill' ? 'default' : 'outline'}
                  onClick={() => setResourceType('skill')}
                >
                  Skill
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resource-title">Title</Label>
                <Input id="resource-title" required placeholder="Distributed Consensus in Go" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="source-url">Source URL</Label>
                <div className="relative">
                  <Github className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    id="source-url"
                    type="url"
                    required
                    placeholder="https://github.com/username/repo"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  required
                  className="min-h-[120px]"
                  placeholder="What does this resource solve and when should it be used?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" placeholder="go, architecture, distributed-systems" />
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">example</Badge>
                  <Badge variant="outline">tags</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit resource'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageLayout>
  );
};
