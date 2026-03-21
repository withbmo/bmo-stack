'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type OrbitingCirclesProps = {
  children: ReactNode;
  className?: string;
  radius?: number;
  iconSize?: number;
  speed?: number;
  reverse?: boolean;
  showOrbitPath?: boolean;
  orbitPathClassName?: string;
};

export function OrbitingCircles({
  children,
  className,
  radius = 140,
  iconSize = 32,
  speed = 1,
  reverse = false,
  showOrbitPath = true,
  orbitPathClassName,
}: OrbitingCirclesProps) {
  const items = Array.isArray(children) ? children : [children];
  const duration = Math.max(8, 20 / Math.max(0.25, speed));

  return (
    <div
      className={cn('absolute left-1/2 top-1/2', className)}
      style={{
        animation: `spin ${duration}s linear infinite${reverse ? ' reverse' : ''}`,
      }}
    >
      {showOrbitPath ? (
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute rounded-full border border-white/20',
            orbitPathClassName,
          )}
          style={{
            width: radius * 2,
            height: radius * 2,
            marginLeft: -radius,
            marginTop: -radius,
          }}
        />
      ) : null}
      {items.map((child, index) => {
        const angle = (360 / items.length) * index;
        return (
          <div
            key={index}
            className="absolute grid place-items-center text-foreground"
            style={{
              width: iconSize,
              height: iconSize,
              transform: `rotate(${angle}deg) translateX(${radius}px) rotate(-${angle}deg)`,
              transformOrigin: 'center',
              marginLeft: -(iconSize / 2),
              marginTop: -(iconSize / 2),
            }}
          >
            <div className="grid h-full w-full place-items-center [&_svg]:h-full [&_svg]:w-full">
              {child}
            </div>
          </div>
        );
      })}
    </div>
  );
}
