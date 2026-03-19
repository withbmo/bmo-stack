import { Button } from '@pytholit/ui/ui';
import type { ButtonHTMLAttributes } from 'react';

interface AuthSubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md';
}

export const AuthSubmitButton = ({
  size = 'md',
  children,
  disabled,
  type,
  ...props
}: AuthSubmitButtonProps) => (
  <Button
    variant="primary"
    size={size}
    fullWidth
    disabled={disabled}
    type={type as 'submit' | 'button' | 'reset' | undefined}
    {...(props as any)}
  >
    {children}
  </Button>
);
