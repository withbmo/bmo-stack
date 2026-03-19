'use client';

import type { HTMLMotionProps } from 'motion/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { forwardRef, type ReactNode } from 'react';

import { cn } from '../utils/cn';
import { MOTION_DISTANCE, MOTION_DURATION, MOTION_EASE } from './tokens';
import {
  fadeVariants,
  scaleInVariants,
  slideRightVariants,
  slideUpVariants,
  staggerContainerVariants,
} from './variants';

const MOTION_ELEMENTS = {
  article: motion.article,
  aside: motion.aside,
  div: motion.div,
  form: motion.form,
  header: motion.header,
  li: motion.li,
  main: motion.main,
  nav: motion.nav,
  p: motion.p,
  section: motion.section,
  span: motion.span,
  tbody: motion.tbody,
  tr: motion.tr,
  ul: motion.ul,
} as const;

type MotionElementTag = keyof typeof MOTION_ELEMENTS;

type SharedMotionProps = {
  [T in MotionElementTag]: Omit<HTMLMotionProps<T>, 'children' | 'className'> & {
    as?: T;
    className?: string;
    children: ReactNode;
    delay?: number;
    once?: boolean;
  };
}[MotionElementTag];

function renderMotion(as: MotionElementTag, props: Record<string, unknown>) {
  const Component = MOTION_ELEMENTS[as] as any;
  return <Component {...props} />;
}

export function MotionFade({
  as = 'div',
  className,
  children,
  delay = 0,
  once = false,
  ...props
}: SharedMotionProps) {
  return renderMotion(as, {
    className,
    children,
    initial: 'hidden',
    animate: once ? undefined : 'visible',
    whileInView: once ? 'visible' : undefined,
    exit: 'exit',
    variants: fadeVariants(delay),
    viewport: once ? { once: true, amount: 0.18 } : undefined,
    ...props,
  });
}

export function MotionSlideIn({
  as = 'div',
  className,
  children,
  delay = 0,
  once = false,
  direction = 'up',
  distance = MOTION_DISTANCE.md as number,
  ...props
}: SharedMotionProps & {
  direction?: 'up' | 'right';
  distance?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const resolvedVariants = prefersReducedMotion
    ? fadeVariants(delay)
    : direction === 'right'
      ? slideRightVariants(delay, Number(distance))
      : slideUpVariants(delay, Number(distance));

  return renderMotion(as, {
    className,
    children,
    initial: 'hidden',
    animate: once ? undefined : 'visible',
    whileInView: once ? 'visible' : undefined,
    exit: 'exit',
    variants: resolvedVariants,
    viewport: once ? { once: true, amount: 0.18 } : undefined,
    ...props,
  });
}

export function MotionScaleIn({
  as = 'div',
  className,
  children,
  delay = 0,
  once = false,
  ...props
}: SharedMotionProps) {
  const prefersReducedMotion = useReducedMotion();
  return renderMotion(as, {
    className,
    children,
    initial: 'hidden',
    animate: once ? undefined : 'visible',
    whileInView: once ? 'visible' : undefined,
    exit: 'exit',
    variants: prefersReducedMotion ? fadeVariants(delay) : scaleInVariants(delay),
    viewport: once ? { once: true, amount: 0.18 } : undefined,
    ...props,
  });
}

export function MotionStagger({
  as = 'div',
  className,
  children,
  stagger = 0.08,
  delayChildren = 0,
  ...props
}: SharedMotionProps & {
  stagger?: number;
  delayChildren?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  return renderMotion(as, {
    className,
    children,
    initial: 'hidden',
    animate: 'visible',
    exit: 'exit',
    variants: staggerContainerVariants(prefersReducedMotion ? 0 : stagger, delayChildren),
    ...props,
  });
}

export function PageTransition({
  as = 'div',
  className,
  children,
  delay = 0,
  ...props
}: SharedMotionProps) {
  const prefersReducedMotion = useReducedMotion();
  return renderMotion(as, {
    className: cn(className),
    children,
    initial: 'hidden',
    animate: 'visible',
    exit: 'exit',
    variants: prefersReducedMotion
      ? fadeVariants(delay)
      : slideUpVariants(delay, MOTION_DISTANCE.sm as number),
    transition: {
      duration: MOTION_DURATION.base,
      ease: MOTION_EASE.standard,
    },
    ...props,
  });
}

export const Presence = AnimatePresence;

export const MotionPopover = forwardRef<
  HTMLDivElement,
  Omit<HTMLMotionProps<'div'>, 'children' | 'className'> & {
    children: ReactNode;
    className?: string;
  }
>(function MotionPopover({ children, className, ...props }, ref) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={
        prefersReducedMotion ? fadeVariants() : slideUpVariants(0, MOTION_DISTANCE.sm as number)
      }
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
});

export function MotionBackdrop({
  children,
  className,
  ...props
}: Omit<HTMLMotionProps<'div'>, 'children' | 'className'> & {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: MOTION_DURATION.fast, ease: MOTION_EASE.crisp }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
