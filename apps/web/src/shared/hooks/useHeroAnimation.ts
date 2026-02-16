import { useCallback,useEffect, useState } from 'react';

import { HERO_ANIMATION } from '../constants';

export type HeroPhase = 'chat' | 'agent' | 'code' | 'deploy';

interface UseHeroAnimationOptions {
  /** The user prompt to type */
  userPrompt: string;
  /** The agent reply to type */
  agentReply: string;
  /** Code lines to display */
  codeLines: string[];
  /** Deploy terminal lines */
  deployLines: string[];
}

interface UseHeroAnimationReturn {
  /** Current animation phase */
  phase: HeroPhase;
  /** User message being typed */
  userMessage: string;
  /** Agent text being typed */
  agentText: string;
  /** Code lines displayed so far */
  displayedCodeLines: string[];
  /** Number of deploy lines shown */
  deployLineIndex: number;
  /** Whether deployment is complete */
  isDeployDone: boolean;
}

/**
 * Hook for managing the hero section's multi-phase animation
 * Cycles through: chat -> agent -> code -> deploy -> (loop)
 */
export function useHeroAnimation({
  userPrompt,
  agentReply,
  codeLines,
  deployLines,
}: UseHeroAnimationOptions): UseHeroAnimationReturn {
  const [phase, setPhase] = useState<HeroPhase>('chat');
  const [userMessage, setUserMessage] = useState('');
  const [agentText, setAgentText] = useState('');
  const [displayedCodeLines, setDisplayedCodeLines] = useState<string[]>([]);
  const [deployLineIndex, setDeployLineIndex] = useState(0);

  const isDeployDone = phase === 'deploy' && deployLineIndex >= deployLines.length;

  // Reset all state for loop restart
  const resetAnimation = useCallback(() => {
    setPhase('chat');
    setUserMessage('');
    setAgentText('');
    setDisplayedCodeLines([]);
    setDeployLineIndex(0);
  }, []);

  // Phase 1: User message typing
  useEffect(() => {
    if (phase !== 'chat') return;

    let i = 0;
    const interval = setInterval(() => {
      if (i <= userPrompt.length) {
        setUserMessage(userPrompt.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase('agent'), HERO_ANIMATION.CHAT_TO_AGENT_DELAY);
      }
    }, HERO_ANIMATION.USER_TYPING_SPEED);

    return () => clearInterval(interval);
  }, [phase, userPrompt]);

  // Phase 2: Agent reply typing
  useEffect(() => {
    if (phase !== 'agent') return;

    setAgentText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i <= agentReply.length) {
        setAgentText(agentReply.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase('code'), HERO_ANIMATION.AGENT_TO_CODE_DELAY);
      }
    }, HERO_ANIMATION.AGENT_TYPING_SPEED);

    return () => clearInterval(interval);
  }, [phase, agentReply]);

  // Phase 3: Code typing into editor
  useEffect(() => {
    if (phase !== 'code') return;

    setDisplayedCodeLines([]);
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < codeLines.length) {
        const line = codeLines[currentLine];
        if (line !== undefined) {
          setDisplayedCodeLines((prev) => [...prev, line]);
        }
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase('deploy'), HERO_ANIMATION.CODE_TO_DEPLOY_DELAY);
      }
    }, HERO_ANIMATION.CODE_LINE_SPEED);

    return () => clearInterval(interval);
  }, [phase, codeLines]);

  // Phase 4: Deployment lines
  useEffect(() => {
    if (phase !== 'deploy') return;
    if (deployLineIndex >= deployLines.length) return;

    const timer = setTimeout(
      () => setDeployLineIndex((i) => i + 1),
      HERO_ANIMATION.DEPLOY_LINE_DELAY
    );

    return () => clearTimeout(timer);
  }, [phase, deployLineIndex, deployLines.length]);

  // Loop: restart animation after deploy completes
  useEffect(() => {
    if (!isDeployDone) return;

    const timer = setTimeout(resetAnimation, HERO_ANIMATION.LOOP_RESTART_DELAY);

    return () => clearTimeout(timer);
  }, [isDeployDone, resetAnimation]);

  return {
    phase,
    userMessage,
    agentText,
    displayedCodeLines,
    deployLineIndex,
    isDeployDone,
  };
}
