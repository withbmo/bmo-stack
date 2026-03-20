'use client';

import { BackgroundLayers } from '@pytholit/ui/blocks';
import { Input } from '@pytholit/ui/ui';
import {
  ArrowRight,
  Brain,
  Check,
  FileText,
  Github,
  Link as LinkIcon,
  Terminal,
  Upload,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { DashboardPageHeader, PageLayout } from '@/shared/components/layout';

export const ContributeRoute = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeType, setActiveType] = useState<'readme' | 'skill'>('readme');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => router.push('/dashboard/hub'), 2500);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-bg-canvas p-6">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <BackgroundLayers />
        </div>
        <div className="relative z-10 w-full max-w-md animate-in zoom-in-95 border border-brand-accent bg-bg-surface p-8 text-center shadow-[var(--shadow-panel)] duration-300">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-brand-accent bg-brand-accent/10">
            <Check size={32} className="text-brand-accent" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 font-sans">TRANSMISSION COMPLETE</h2>
          <p className="mb-6 font-mono text-xs text-text-muted">
            Your resource has been uploaded to the decentralised knowledge graph. Verification
            pending...
          </p>
          <div className="h-1 w-full overflow-hidden rounded-full bg-border-default/20">
            <div className="h-full bg-brand-accent animate-[loading_2s_ease-in-out]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageLayout className="pb-12">
      <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <DashboardPageHeader
        badge={{ icon: Upload, label: 'CONTRIBUTE' }}
        title={
          <>
            CONTRIBUTE <span className="text-brand-primary">ARTIFACT</span>
          </>
        }
        subtitle="Share your knowledge with the community"
        actions={
          <button
            onClick={() => router.push('/dashboard/hub')}
            className="group flex items-center gap-2 font-mono text-xs text-text-muted transition-colors hover:text-brand-primary"
          >
            <ArrowRight
              className="rotate-180 group-hover:-translate-x-1 transition-transform"
                size={12}
              />{' '}
              BACK TO HUB
            </button>
          }
          className="mb-12"
        />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Type Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setActiveType('readme')}
              className={`p-6 border-2 transition-all flex flex-col items-center gap-3 group relative overflow-hidden
                  ${
                    activeType === 'readme'
                      ? 'border-brand-primary bg-brand-primary/5'
                      : 'border-border-default bg-bg-surface hover:border-text-secondary'
                  }`}
            >
              <FileText
                size={24}
                className={
                  activeType === 'readme'
                    ? 'text-brand-primary'
                    : 'text-text-muted group-hover:text-white'
                }
              />
              <div className="text-center relative z-10">
                <div
                  className={`font-mono text-sm font-bold mb-1 ${
                    activeType === 'readme'
                      ? 'text-white'
                      : 'text-text-muted group-hover:text-white'
                  }`}
                >
                  PROTOCOL (README)
                </div>
                <div className="text-[10px] text-text-muted">Code patterns & Boilerplates</div>
              </div>
              {activeType === 'readme' && (
                <div className="absolute top-2 right-2 text-brand-primary">
                  <Check size={14} />
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveType('skill')}
              className={`p-6 border-2 transition-all flex flex-col items-center gap-3 group relative overflow-hidden
                  ${
                    activeType === 'skill'
                      ? 'border-brand-primary bg-brand-primary/5'
                      : 'border-border-default bg-bg-surface hover:border-text-secondary'
                  }`}
            >
              <Brain
                size={24}
                className={
                  activeType === 'skill'
                    ? 'text-brand-primary'
                    : 'text-text-muted group-hover:text-white'
                }
              />
              <div className="text-center relative z-10">
                <div
                  className={`font-mono text-sm font-bold mb-1 ${
                    activeType === 'skill'
                      ? 'text-white'
                      : 'text-text-muted group-hover:text-white'
                  }`}
                >
                  COGNITION (SKILL)
                </div>
                <div className="text-[10px] text-text-muted">Conceptual Roadmaps</div>
              </div>
              {activeType === 'skill' && (
                <div className="absolute top-2 right-2 text-brand-primary">
                  <Check size={14} />
                </div>
              )}
            </button>
          </div>

          {/* Details */}
          <div className="relative space-y-6 border border-border-default bg-bg-panel p-8 shadow-[var(--shadow-panel)]">
            <div className="absolute left-0 top-0 h-2 w-2 border-l border-t border-brand-primary"></div>
            <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-brand-primary"></div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand-primary">
                <Terminal size={12} /> Resource Title
              </label>
              <Input required type="text" placeholder="e.g. Distributed Consensus in Go" />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand-primary">
                <LinkIcon size={12} /> Source URL
              </label>
              <div className="flex">
                <div className="flex items-center justify-center border border-r-0 border-border-default bg-border-default/20 px-4">
                  <Github size={16} className="text-text-muted" />
                </div>
                <Input
                  required
                  type="url"
                  placeholder="https://github.com/username/repo"
                  className="flex-grow min-w-0 rounded-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs uppercase tracking-wider text-brand-primary">
                Description
              </label>
              <Input
                required
                multiline
                rows={4}
                placeholder="Briefly explain what problem this resource solves..."
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs uppercase tracking-wider text-brand-primary">
                Tags (Comma Separated)
              </label>
              <Input type="text" placeholder="rust, systems, low-level" />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-3 border border-white/20 bg-brand-primary px-10 py-4 font-mono text-sm font-bold text-white transition-all shadow-[var(--shadow-brand)] hover:translate-x-1 hover:translate-y-1 hover:bg-brand-neon hover:shadow-none
                  ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isSubmitting ? (
                <>
                  UPLOADING{' '}
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                <>
                  INIT_UPLOAD <Upload size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};
