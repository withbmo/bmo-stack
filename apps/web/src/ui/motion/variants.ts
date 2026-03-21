import type { Transition, Variants } from 'motion/react';

import { MOTION_DISTANCE, MOTION_DURATION, MOTION_EASE } from './tokens';

const transition = (delay: number = 0, duration: number = MOTION_DURATION.base): Transition => ({
  delay,
  duration,
  ease: MOTION_EASE.standard,
});

export function fadeVariants(delay: number = 0): Variants {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: transition(delay, MOTION_DURATION.base) },
    exit: { opacity: 0, transition: transition(0, MOTION_DURATION.fast) },
  };
}

export function slideUpVariants(
  delay: number = 0,
  distance: number = MOTION_DISTANCE.md
): Variants {
  return {
    hidden: { opacity: 0, y: distance },
    visible: { opacity: 1, y: 0, transition: transition(delay, MOTION_DURATION.base) },
    exit: {
      opacity: 0,
      y: Math.max(4, distance / 2),
      transition: transition(0, MOTION_DURATION.fast),
    },
  };
}

export function slideRightVariants(
  delay: number = 0,
  distance: number = MOTION_DISTANCE.md
): Variants {
  return {
    hidden: { opacity: 0, x: -distance },
    visible: { opacity: 1, x: 0, transition: transition(delay, MOTION_DURATION.base) },
    exit: {
      opacity: 0,
      x: -Math.max(4, distance / 2),
      transition: transition(0, MOTION_DURATION.fast),
    },
  };
}

export function scaleInVariants(delay: number = 0): Variants {
  return {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1, transition: transition(delay, MOTION_DURATION.base) },
    exit: { opacity: 0, scale: 0.98, transition: transition(0, MOTION_DURATION.fast) },
  };
}

export function staggerContainerVariants(
  stagger: number = 0.08,
  delayChildren: number = 0
): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        delayChildren,
        staggerChildren: stagger,
      },
    },
    exit: {
      transition: {
        staggerChildren: Math.min(0.04, stagger / 2),
        staggerDirection: -1,
      },
    },
  };
}
