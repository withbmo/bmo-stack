'use client';

import { MotionSlideIn, MotionStagger } from '@pytholit/ui/ui';
import { BackgroundLayers, GlitchText } from '@pytholit/ui/blocks';
import { Button } from '@pytholit/ui/ui';
import { Box, Globe, ShieldCheck, Terminal, Zap } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { useHeroAnimation } from '@/shared/hooks/useHeroAnimation';
import { MockIDE } from '@/site/components/MockIDE';
import { HERO_PYTHON_CODE } from '@/site/data/home';

// Animation content
const USER_PROMPT = 'Build a Python health check';
const AGENT_REPLY = 'Creating main.py with a health endpoint...';
const DEPLOY_LINES = [
  '> Building image...',
  '> Pushing to registry...',
  '> Deploying to US-EAST-1...',
  '> Live at https://app.pytholit.com',
];
const CODE_LINES = HERO_PYTHON_CODE.split('\n');

/**
 * Hero section with animated IDE preview
 */
export const HeroSection = () => {
  const { phase, userMessage, agentText, displayedCodeLines, deployLineIndex, isDeployDone } =
    useHeroAnimation({
      userPrompt: USER_PROMPT,
      agentReply: AGENT_REPLY,
      codeLines: CODE_LINES,
      deployLines: DEPLOY_LINES,
    });

  return (
    <section className="relative flex min-h-screen flex-col border-b border-border-default bg-bg-app px-6 pb-20 pt-32">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <BackgroundLayers />
      </div>

      <div className="relative z-20 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-16 lg:grid-cols-2">
        {/* Left Column - Hero Content */}
        <HeroContent />

        {/* Right Column - Mock IDE */}
        <MockIDE
          phase={phase}
          userMessage={userMessage}
          agentText={agentText}
          codeLines={displayedCodeLines}
          deployLines={DEPLOY_LINES}
          deployLineIndex={deployLineIndex}
          isDeployDone={isDeployDone}
        />
      </div>
    </section>
  );
};

const HeroContent = () => (
  <MotionStagger className="space-y-8">
    {/* Headline */}
    <MotionSlideIn as="div">
      <h2 className="text-6xl md:text-8xl font-sans font-bold leading-[0.9] tracking-tighter">
        Build Python <br />
        <GlitchText
          text="RUNTIMES"
          className="bg-gradient-to-r from-text-primary via-text-secondary to-brand-primary bg-clip-text text-transparent"
        />
      </h2>
    </MotionSlideIn>

    {/* Description */}
    <MotionSlideIn
      as="p"
      className="max-w-xl border-l-2 border-brand-primary bg-bg-overlay/60 py-3 pl-6 font-mono text-lg text-text-secondary/80 backdrop-blur-sm md:text-xl"
    >
      A brutalist runtime for teams that ship fast. Prompt the runtime, edit code, and deploy
      globally without leaving the browser.
    </MotionSlideIn>

    <MotionStagger className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
      <HeroPill icon={<Zap size={16} />} title="Sub-second boot" detail="Zero-config containers" />
      <HeroPill
        icon={<ShieldCheck size={16} />}
        title="Built-in guardrails"
        detail="Secure defaults"
      />
      <HeroPill icon={<Globe size={16} />} title="Global edge" detail="Multi-region deploys" />
    </MotionStagger>

    {/* CTA Buttons */}
    <MotionSlideIn as="div" className="flex flex-col sm:flex-row gap-4 pt-2 items-start">
      <Button variant="primary" size="md" asChild>
        <Link href="/auth/signup">
          <Terminal size={20} />
          START FREE
        </Link>
      </Button>
      <Button variant="secondary" size="lg" className="z-20" asChild>
        <Link href="/docs">
          <Box size={20} />
          READ DOCS
        </Link>
      </Button>
    </MotionSlideIn>
  </MotionStagger>
);

interface HeroPillProps {
  icon: ReactNode;
  title: string;
  detail: string;
}

const HeroPill = ({ icon, title, detail }: HeroPillProps) => (
  <MotionSlideIn className="flex flex-col gap-2 border border-border-default/70 bg-bg-panel/70 px-4 py-3">
    <div className="flex items-center gap-2 text-brand-primary">
      {icon}
      <span className="font-mono text-xs uppercase tracking-widest">{title}</span>
    </div>
    <div className="font-mono text-xs text-text-secondary/70">{detail}</div>
  </MotionSlideIn>
);
