/**
 * Animation timing constants
 * Centralized configuration for all animation-related timings
 */

// Hero animation phase timings (in milliseconds)
export const HERO_ANIMATION = {
  // Typing speeds
  USER_TYPING_SPEED: 60,
  AGENT_TYPING_SPEED: 40,
  CODE_LINE_SPEED: 120,
  DEPLOY_LINE_DELAY: 600,

  // Phase transition delays
  CHAT_TO_AGENT_DELAY: 800,
  AGENT_TO_CODE_DELAY: 600,
  CODE_TO_DEPLOY_DELAY: 500,
  LOOP_RESTART_DELAY: 4000,
} as const;

// Typewriter animation defaults
export const TYPEWRITER = {
  DEFAULT_SPEED: 50,
  FAST_SPEED: 30,
  SLOW_SPEED: 80,
} as const;

// General UI animation timings
export const UI_ANIMATION = {
  TRANSITION_FAST: 150,
  TRANSITION_NORMAL: 300,
  TRANSITION_SLOW: 500,
} as const;
