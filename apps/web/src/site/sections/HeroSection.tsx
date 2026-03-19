'use client';

import { MotionSlideIn, MotionStagger } from '@pytholit/ui';
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
    <section className="relative min-h-screen pt-32 pb-20 px-6 flex flex-col border-b border-nexus-gray bg-nexus-black">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <BackgroundLayers />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-20 flex-1">
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
          className="text-transparent bg-clip-text bg-gradient-to-r from-white via-nexus-light to-nexus-purple"
        />
      </h2>
    </MotionSlideIn>

    {/* Description */}
    <MotionSlideIn
      as="p"
      className="font-mono text-nexus-light/70 text-lg md:text-xl max-w-xl border-l-2 border-nexus-purple pl-6 py-3 bg-black/30 backdrop-blur-sm"
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
  <MotionSlideIn className="border border-nexus-gray/70 bg-nexus-dark/70 px-4 py-3 flex flex-col gap-2">
    <div className="flex items-center gap-2 text-nexus-purple">
      {icon}
      <span className="font-mono text-xs uppercase tracking-widest">{title}</span>
    </div>
    <div className="text-nexus-light/70 font-mono text-xs">{detail}</div>
  </MotionSlideIn>
);
