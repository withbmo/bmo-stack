'use client';

import { useMutation } from '@tanstack/react-query';
import { Terminal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from '@pytholit/ui/ui';

import { DashboardPageHeader, PageLayout } from '@/dashboard/components';
import { env } from '@/env';
import { useAuth } from '@/shared/auth';
import { DEFAULT_PROJECT_CONFIG, type ProjectWizardConfig } from '@/shared/constants/project-wizard';
import { createProject } from '@/shared/lib/projects';
import { fetchWizardSchema, generateWizard } from '@/shared/lib/wizard';
import type { WizardSchema } from '@/shared/types';

import { StepConfig, StepReview } from './new';

export const NewProjectRoute = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [config, setConfig] = useState<ProjectWizardConfig>(DEFAULT_PROJECT_CONFIG);
  const [schema, setSchema] = useState<WizardSchema | null>(null);
  const [schemaError, setSchemaError] = useState(false);
  const { user, hydrated } = useAuth();
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!hydrated || !user) throw new Error('Not authenticated');
      return createProject(undefined, { name: config.name || 'untitled-project' });
    },
  });

  useEffect(() => {
    if (!hydrated || !user) return;
    const version = env.NEXT_PUBLIC_WIZARD_SCHEMA_VERSION || 'latest';
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchWizardSchema(undefined, String(version));
        if (cancelled) return;
        setSchema(data);
        setSchemaError(false);
      } catch {
        if (cancelled) return;
        setSchema(null);
        setSchemaError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrated, user]);

  const handleDeploy = () => {
    setIsDeploying(true);
    createMutation.mutate(undefined, {
      onSuccess: async project => {
        try {
          if (!hydrated || !user) throw new Error('Not authenticated');
          const version = env.NEXT_PUBLIC_WIZARD_SCHEMA_VERSION || 'latest';
          const result = await generateWizard(
            undefined,
            String(version),
            project.id,
            config as unknown as Record<string, unknown>
          );
          toast.success('Project generated');
          router.push(`/editor/${project.id}?manifestId=${encodeURIComponent(result.manifestId)}`);
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to generate project';
          toast.error(msg);
        }
      },
      onError: err => {
        const msg = err instanceof Error ? err.message : 'Failed to create project';
        toast.error(msg);
      },
      onSettled: () => setIsDeploying(false),
    });
  };

  return (
    <PageLayout className="pb-12">
      <div className="max-w-4xl mx-auto">
        <DashboardPageHeader
          badge={{ icon: Terminal, label: 'NEW PROJECT' }}
          title={
            <>
              NEW <span className="text-text-muted">PROJECT</span>
            </>
          }
          subtitle="Configure and create a new project"
          actions={<div className="font-mono text-xs text-text-muted">STEP {step} / 2</div>}
          className="mb-12"
        />

        {step === 1 && schema && (
          <StepConfig
            config={config}
            setConfig={setConfig}
            schema={schema}
            onNext={() => setStep(2)}
          />
        )}
        {step === 1 && !schema && (
          <div className="font-mono text-sm text-text-muted">
            {schemaError ? (
              <div className="border border-border-default bg-bg-app p-6">
                WIZARD_SCHEMA_UNAVAILABLE. Please try again later.
              </div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="h-4 w-56 animate-pulse rounded bg-border-default/30" />
                  <div className="space-y-3">
                    <div className="h-14 w-full animate-pulse rounded border border-border-default bg-border-default/10" />
                    <div className="h-24 w-full animate-pulse rounded border border-border-default bg-border-default/10" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-4 w-40 animate-pulse rounded bg-border-default/30" />
                  <div className="h-24 w-full animate-pulse rounded border border-border-default bg-border-default/10" />
                </div>

                <div className="space-y-3">
                  <div className="h-4 w-56 animate-pulse rounded bg-border-default/30" />
                  <div className="h-20 w-full animate-pulse rounded border border-border-default bg-border-default/10" />
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <StepReview
            config={config}
            onBack={() => setStep(1)}
            onDeploy={handleDeploy}
            isDeploying={isDeploying}
          />
        )}
      </div>
    </PageLayout>
  );
};
