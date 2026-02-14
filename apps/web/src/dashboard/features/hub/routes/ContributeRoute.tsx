'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  FileText,
  Brain,
  Check,
  ArrowRight,
  Github,
  Link as LinkIcon,
  Terminal,
} from 'lucide-react';
import { BackgroundLayers, Input } from '@/dashboard/components';
import { PageLayout } from '@/dashboard/shared/layout/PageLayout';
import { DashboardPageHeader } from '@/dashboard/shared/layout/DashboardPageHeader';

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
      <div className="min-h-screen bg-nexus-black flex items-center justify-center p-6 relative">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <BackgroundLayers />
        </div>
        <div className="relative z-10 max-w-md w-full bg-bg-surface border border-nexus-accent p-8 text-center animate-in zoom-in-95 duration-300 nexus-shadow shadow-[0_0_50px_-10px_rgba(0,255,148,0.2)]">
          <div className="w-16 h-16 bg-nexus-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-nexus-accent">
            <Check size={32} className="text-nexus-accent" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 font-sans">TRANSMISSION COMPLETE</h2>
          <p className="font-mono text-xs text-nexus-muted mb-6">
            Your resource has been uploaded to the decentralised knowledge graph. Verification
            pending...
          </p>
          <div className="h-1 w-full bg-nexus-gray/20 rounded-full overflow-hidden">
            <div className="h-full bg-nexus-accent animate-[loading_2s_ease-in-out]"></div>
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
              CONTRIBUTE <span className="text-nexus-purple">ARTIFACT</span>
            </>
          }
          subtitle="Share your knowledge with the community"
          actions={
            <button
              onClick={() => router.push('/dashboard/hub')}
              className="text-xs font-mono text-nexus-muted hover:text-nexus-purple flex items-center gap-2 transition-colors group"
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
                      ? 'border-nexus-purple bg-nexus-purple/5'
                      : 'border-nexus-gray bg-bg-surface hover:border-nexus-light'
                  }`}
            >
              <FileText
                size={24}
                className={
                  activeType === 'readme'
                    ? 'text-nexus-purple'
                    : 'text-nexus-muted group-hover:text-white'
                }
              />
              <div className="text-center relative z-10">
                <div
                  className={`font-mono text-sm font-bold mb-1 ${
                    activeType === 'readme'
                      ? 'text-white'
                      : 'text-nexus-muted group-hover:text-white'
                  }`}
                >
                  PROTOCOL (README)
                </div>
                <div className="text-[10px] text-nexus-muted">Code patterns & Boilerplates</div>
              </div>
              {activeType === 'readme' && (
                <div className="absolute top-2 right-2 text-nexus-purple">
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
                      ? 'border-nexus-purple bg-nexus-purple/5'
                      : 'border-nexus-gray bg-bg-surface hover:border-nexus-light'
                  }`}
            >
              <Brain
                size={24}
                className={
                  activeType === 'skill'
                    ? 'text-nexus-purple'
                    : 'text-nexus-muted group-hover:text-white'
                }
              />
              <div className="text-center relative z-10">
                <div
                  className={`font-mono text-sm font-bold mb-1 ${
                    activeType === 'skill'
                      ? 'text-white'
                      : 'text-nexus-muted group-hover:text-white'
                  }`}
                >
                  COGNITION (SKILL)
                </div>
                <div className="text-[10px] text-nexus-muted">Conceptual Roadmaps</div>
              </div>
              {activeType === 'skill' && (
                <div className="absolute top-2 right-2 text-nexus-purple">
                  <Check size={14} />
                </div>
              )}
            </button>
          </div>

          {/* Details */}
          <div className="bg-bg-panel border border-nexus-gray p-8 space-y-6 relative nexus-shadow">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-nexus-purple"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-nexus-purple"></div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-nexus-purple uppercase tracking-wider flex items-center gap-2">
                <Terminal size={12} /> Resource Title
              </label>
              <Input required type="text" placeholder="e.g. Distributed Consensus in Go" />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-nexus-purple uppercase tracking-wider flex items-center gap-2">
                <LinkIcon size={12} /> Source URL
              </label>
              <div className="flex">
                <div className="bg-nexus-gray/20 border border-r-0 border-nexus-gray px-4 flex items-center justify-center">
                  <Github size={16} className="text-nexus-muted" />
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
              <label className="font-mono text-xs text-nexus-purple uppercase tracking-wider">
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
              <label className="font-mono text-xs text-nexus-purple uppercase tracking-wider">
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
              className={`bg-nexus-purple text-white font-mono font-bold text-sm px-10 py-4 flex items-center gap-3 transition-all hover:bg-nexus-neon nexus-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none border border-white/20
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
