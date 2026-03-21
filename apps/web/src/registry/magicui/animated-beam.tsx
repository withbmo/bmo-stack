'use client';

import { cn } from '@/lib/utils';
import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

type AnimatedBeamProps = {
  containerRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  curvature?: number;
  endYOffset?: number;
  reverse?: boolean;
  duration?: number;
  className?: string;
};

export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  endYOffset = 0,
  reverse = false,
  duration = 4,
  className,
}: AnimatedBeamProps) {
  const [path, setPath] = useState<string>('');
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () => {
      const container = containerRef.current;
      const from = fromRef.current;
      const to = toRef.current;
      if (!container || !from || !to) return;

      const c = container.getBoundingClientRect();
      const f = from.getBoundingClientRect();
      const t = to.getBoundingClientRect();

      const startX = f.left + f.width / 2 - c.left;
      const startY = f.top + f.height / 2 - c.top;
      const endX = t.left + t.width / 2 - c.left;
      const endY = t.top + t.height / 2 - c.top + endYOffset;

      const dx = endX - startX;
      const cp1X = startX + dx * 0.25;
      const cp1Y = startY + curvature;
      const cp2X = startX + dx * 0.75;
      const cp2Y = endY - curvature;

      setPath(`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`);
      setSize({ width: c.width, height: c.height });
    };

    const raf = requestAnimationFrame(update);
    const onResize = () => update();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [containerRef, fromRef, toRef, curvature, endYOffset]);

  if (!path || size.width === 0 || size.height === 0) return null;

  const id = `beam-${Math.random().toString(36).slice(2)}`;

  return (
    <svg
      className={cn('pointer-events-none absolute inset-0', className)}
      width={size.width}
      height={size.height}
      viewBox={`0 0 ${size.width} ${size.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={size.width} y2="0">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
          <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      <path d={path} stroke="var(--border)" strokeOpacity="0.35" strokeWidth="1.5" />
      <path d={path} stroke={`url(#${id})`} strokeWidth="2" strokeLinecap="round" />

      <circle r="2.5" fill="var(--primary)">
        <animateMotion dur={`${duration}s`} repeatCount="indefinite" path={path} />
        {reverse ? <animate attributeName="opacity" values="0;1;0" dur={`${duration}s`} repeatCount="indefinite" /> : null}
      </circle>
    </svg>
  );
}
