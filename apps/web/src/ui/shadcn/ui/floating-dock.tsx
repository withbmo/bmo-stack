'use client';

import type { MouseEvent, ReactNode } from 'react';
import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { Menu } from 'lucide-react';

import { cn } from '@/lib/utils';

export type FloatingDockItem = {
  title: string;
  icon: ReactNode;
  href: string;
  active?: boolean;
  destructive?: boolean;
  onClick?: (e: MouseEvent<HTMLElement>) => void | Promise<void>;
};

export function FloatingDock({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: FloatingDockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
}) {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
}

function FloatingDockMobile({
  items,
  className,
}: {
  items: FloatingDockItem[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn('relative block md:hidden', className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="dashboard-dock-mobile"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10, transition: { delay: idx * 0.04 } }}
                transition={{ delay: (items.length - 1 - idx) * 0.04 }}
              >
                <DockLink
                  item={item}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border bg-background shadow-sm',
                    item.active && 'border-primary bg-primary/10 text-primary',
                    item.destructive && !item.active && 'border-destructive/30 text-destructive hover:bg-destructive/10'
                  )}
                  onNavigated={() => setOpen(false)}
                >
                  <div className="h-4 w-4">{item.icon}</div>
                </DockLink>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="flex h-10 w-10 items-center justify-center rounded-full border bg-background shadow-sm"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>
    </div>
  );
}

function FloatingDockDesktop({
  items,
  className,
}: {
  items: FloatingDockItem[];
  className?: string;
}) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={event => mouseX.set(event.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        'mx-auto hidden h-16 items-end gap-3 rounded-2xl border border-border/80 bg-background/85 px-4 pb-3 shadow-lg backdrop-blur-xl md:flex',
        className
      )}
    >
      {items.map(item => (
        <DockIconContainer key={item.title} mouseX={mouseX} item={item} />
      ))}
    </motion.div>
  );
}

function DockIconContainer({
  mouseX,
  item,
}: {
  mouseX: MotionValue<number>;
  item: FloatingDockItem;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, val => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 76, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 76, 40]);
  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [18, 34, 18]);
  const heightTransformIcon = useTransform(distance, [-150, 0, 150], [18, 34, 18]);

  const width = useSpring(widthTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  const height = useSpring(heightTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  const widthIcon = useSpring(widthTransformIcon, { mass: 0.1, stiffness: 150, damping: 12 });
  const heightIcon = useSpring(heightTransformIcon, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <DockLink item={item}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          'relative flex aspect-square items-center justify-center rounded-full border shadow-sm',
          item.active
            ? 'border-primary/50 bg-primary/15 text-primary'
            : item.destructive
              ? 'border-destructive/30 bg-destructive/5 text-destructive'
              : 'border-border/60 bg-muted text-foreground'
        )}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 2, x: '-50%' }}
              className="absolute -top-8 left-1/2 w-fit whitespace-pre rounded-md border border-border bg-popover px-2 py-0.5 text-xs font-medium text-popover-foreground shadow-sm"
            >
              {item.title}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div style={{ width: widthIcon, height: heightIcon }} className="flex items-center justify-center">
          {item.icon}
        </motion.div>
      </motion.div>
    </DockLink>
  );
}

function DockLink({
  item,
  children,
  className,
  onNavigated,
}: {
  item: FloatingDockItem;
  children: ReactNode;
  className?: string;
  onNavigated?: () => void;
}) {
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    item.onClick?.(event);
    onNavigated?.();
  };

  if (item.href.startsWith('/')) {
    return (
      <Link href={item.href} onClick={handleClick} className={className} aria-label={item.title}>
        {children}
      </Link>
    );
  }

  return (
    <a href={item.href} onClick={handleClick} className={className} aria-label={item.title}>
      {children}
    </a>
  );
}
