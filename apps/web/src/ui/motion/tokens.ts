export const MOTION_DURATION = {
  instant: 0.001,
  fast: 0.18,
  base: 0.28,
  slow: 0.42,
  slower: 0.6,
} as const;

export const MOTION_EASE = {
  standard: [0.16, 1, 0.3, 1],
  smooth: [0.22, 1, 0.36, 1],
  crisp: [0.2, 0.8, 0.2, 1],
} as const;

export const MOTION_DISTANCE = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
} as const;
