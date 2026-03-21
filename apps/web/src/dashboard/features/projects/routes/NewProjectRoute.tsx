'use client';

import Link from 'next/link';
import { Check, Globe, Lock } from 'lucide-react';
import { useMemo, useState } from 'react';

import { DashboardPageHeader, PageLayout } from '@/dashboard/components';
import { Button } from '@/ui/shadcn/ui/button';
import { Input } from '@/ui/shadcn/ui/input';
import { Label } from '@/ui/shadcn/ui/label';
import { Textarea } from '@/ui/shadcn/ui/textarea';

type ProjectVisibility = 'private' | 'public';

const STEPS = [
  { id: 'details', title: 'Details', description: 'Name and visibility' },
  { id: 'template', title: 'Template', description: 'Choose a starter' },
  { id: 'review', title: 'Review', description: 'Confirm and create' },
] as const;

const CURRENT_STEP = 0;

export const NewProjectRoute = () => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<ProjectVisibility>('private');

  const canContinue = useMemo(() => projectName.trim().length > 0, [projectName]);

  return (
    <PageLayout className="pb-12 max-w-5xl mx-auto">
      <DashboardPageHeader
        title="Create a new project"
        subtitle="Set up your project details to get started."
        actions={
          <Button asChild variant="ghost">
            <Link href="/dashboard">Cancel</Link>
          </Button>
        }
      />

      <div className="mt-8 grid gap-12 md:grid-cols-[240px_1fr]">
        {/* Stepper Sidebar */}
        <aside className="hidden md:block">
          <div className="sticky top-8">
            <h3 className="mb-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Project Setup
            </h3>
            <div className="relative space-y-8 before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-border">
              {STEPS.map((step, index) => {
                const isActive = index === CURRENT_STEP;
                const isDone = index < CURRENT_STEP;

                return (
                  <div key={step.id} className="relative flex items-start gap-4">
                    <div
                      className={[
                        'relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-background text-xs font-medium transition-colors',
                        isActive
                          ? 'border-primary text-primary'
                          : isDone
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-muted text-muted-foreground',
                      ].join(' ')}
                    >
                      {isDone ? <Check className="h-3 w-3" /> : index + 1}
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={[
                          'text-sm font-medium leading-none',
                          isActive ? 'text-foreground' : 'text-muted-foreground',
                        ].join(' ')}
                      >
                        {step.title}
                      </span>
                      <span className="mt-1.5 text-xs text-muted-foreground">
                        {step.description}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Mobile Stepper */}
        <div className="md:hidden space-y-2">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>
              Step {CURRENT_STEP + 1} of {STEPS.length}
            </span>
            <span className="text-muted-foreground">{STEPS[CURRENT_STEP].title}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${((CURRENT_STEP + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Form Area */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Project Details</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Set your project name, write a short description, and choose visibility.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="project-name" className="text-sm font-medium">
                Project Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="project-name"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                placeholder="e.g. my-awesome-project"
                className="max-w-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-description" className="text-sm font-medium">
                Description <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Textarea
                id="project-description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe what this project will do..."
                className="min-h-[120px] max-w-2xl resize-y"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Visibility</Label>
              <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
                {/* Private Option */}
                <label
                  className={[
                    'relative flex cursor-pointer flex-col gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50',
                    visibility === 'private'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">Private</span>
                    </div>
                    <div
                      className={[
                        'flex h-4 w-4 items-center justify-center rounded-full border',
                        visibility === 'private' ? 'border-primary' : 'border-muted-foreground/30',
                      ].join(' ')}
                    >
                      {visibility === 'private' && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Only you and invited members can view and collaborate on this project.
                  </p>
                  {/* Hidden radio input for accessibility */}
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    className="sr-only"
                    checked={visibility === 'private'}
                    onChange={() => setVisibility('private')}
                  />
                </label>

                {/* Public Option */}
                <label
                  className={[
                    'relative flex cursor-pointer flex-col gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50',
                    visibility === 'public'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">Public</span>
                    </div>
                    <div
                      className={[
                        'flex h-4 w-4 items-center justify-center rounded-full border',
                        visibility === 'public' ? 'border-primary' : 'border-muted-foreground/30',
                      ].join(' ')}
                    >
                      {visibility === 'public' && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Anyone on the internet can view this project. Only invited members can edit.
                  </p>
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    className="sr-only"
                    checked={visibility === 'public'}
                    onChange={() => setVisibility('public')}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t flex items-center justify-end gap-3 max-w-2xl">
            <Button asChild variant="ghost">
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button disabled={!canContinue} className="min-w-[120px]">
              Continue
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
