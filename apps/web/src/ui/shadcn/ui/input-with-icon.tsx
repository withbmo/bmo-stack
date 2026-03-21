'use client';

import type { LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import { Input } from '@/ui/shadcn/ui/input';
import { cn } from '@/ui/utils/cn';

type InputWithIconProps = ComponentProps<typeof Input> & {
  icon: LucideIcon;
  iconLabel: string;
};

export function InputWithIcon({
  icon: Icon,
  iconLabel,
  className,
  ...props
}: InputWithIconProps) {
  return (
    <div className="relative">
      <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
        <Icon className="size-4" />
        <span className="sr-only">{iconLabel}</span>
      </div>
      <Input className={cn('peer pl-9', className)} {...props} />
    </div>
  );
}
