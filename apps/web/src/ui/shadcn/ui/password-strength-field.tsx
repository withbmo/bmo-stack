'use client';

import { useMemo, useState } from 'react';

import { CheckIcon, EyeIcon, EyeOffIcon, LockIcon, XIcon } from 'lucide-react';

import { Button } from '@/ui/shadcn/ui/button';
import { Input } from '@/ui/shadcn/ui/input';
import { Label } from '@/ui/shadcn/ui/label';
import { cn } from '@/ui/utils/cn';

type PasswordStrengthLike = {
  score: number;
  label: string;
} | null;

const requirements = [
  { regex: /.{8,}/, text: 'At least 8 characters' },
  { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
  { regex: /[0-9]/, text: 'At least 1 number' },
  {
    regex: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
    text: 'At least 1 special character',
  },
];

const MAX_PASSWORD_SCORE = 4;
const PASSWORD_BAR_COUNT = 5;

function getColor(score: number) {
  if (score <= 0) return 'bg-border';
  if (score <= 1) return 'bg-destructive';
  if (score <= 2) return 'bg-orange-500';
  if (score <= 3) return 'bg-amber-500';
  return 'bg-green-500';
}

export function PasswordStrengthField({
  id,
  label = 'Password',
  value,
  error,
  strength,
  onChange,
}: {
  id: string;
  label?: string;
  value: string;
  error?: string;
  strength: PasswordStrengthLike;
  onChange: (value: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  const score = strength?.score ?? 0;
  const filledBars = Math.max(
    0,
    Math.min(
      PASSWORD_BAR_COUNT,
      Math.ceil((score / MAX_PASSWORD_SCORE) * PASSWORD_BAR_COUNT)
    )
  );
  const labelText = value ? strength?.label ?? 'Weak' : 'Enter a password';

  const checks = useMemo(
    () =>
      requirements.map(req => ({
        met: req.regex.test(value),
        text: req.text,
      })),
    [value]
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
          <LockIcon className="size-4" />
          <span className="sr-only">Password</span>
        </div>
        <Input
          id={id}
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          aria-invalid={!!error}
          className="peer pl-9 pr-9"
          required
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(prev => !prev)}
          className="text-muted-foreground absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          {isVisible ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
        </Button>
      </div>

      <div className="flex h-1 w-full gap-1">
        {Array.from({ length: PASSWORD_BAR_COUNT }).map((_, index) => (
          <span
            key={index}
            className={cn(
              'h-full flex-1 rounded-full transition-all duration-500 ease-out',
              index < filledBars ? getColor(score) : 'bg-border'
            )}
          />
        ))}
      </div>

      <p className="text-sm font-medium text-foreground">{labelText}</p>
      <ul className="space-y-1.5">
        {checks.map((req, index) => (
          <li key={index} className="flex items-center gap-2">
            {req.met ? (
              <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
            ) : (
              <XIcon className="size-4 text-muted-foreground" />
            )}
            <span
              className={cn(
                'text-xs',
                req.met
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-muted-foreground'
              )}
            >
              {req.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
