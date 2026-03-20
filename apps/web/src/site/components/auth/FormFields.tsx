import { Input } from '@pytholit/ui/ui';
import { AtSign, Key, Mail, User } from 'lucide-react';

export interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}

export const EmailField = ({
  value,
  onChange,
  readOnly = false,
  placeholder = 'dev@nexus.py',
}: EmailFieldProps) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand-primary">
      <Mail size={12} /> Email
    </label>
    <Input
      type="email"
      required
      value={value}
      onChange={e => onChange(e.target.value)}
      readOnly={readOnly}
      placeholder={placeholder}
    />
  </div>
);

export interface UsernameFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export const UsernameField = ({
  value,
  onChange,
  error,
  placeholder = 'johndoe',
}: UsernameFieldProps) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand-primary">
      <AtSign size={12} /> Username
    </label>
    <Input
      type="text"
      required
      autoComplete="username"
      value={value}
      onChange={e => onChange(e.target.value)}
      error={!!error}
      placeholder={placeholder}
    />
    {error && <p className="font-mono text-xs text-red-500">{error}</p>}
  </div>
);

export interface FirstNameFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export const FirstNameField = ({
  value,
  onChange,
  error,
  placeholder = 'John',
}: FirstNameFieldProps) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand-primary">
      <User size={12} /> First name
    </label>
    <Input
      type="text"
      required
      autoComplete="given-name"
      value={value}
      onChange={e => onChange(e.target.value)}
      error={!!error}
      placeholder={placeholder}
    />
    {error && <p className="font-mono text-xs text-red-500">{error}</p>}
  </div>
);

export interface LastNameFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export const LastNameField = ({
  value,
  onChange,
  error,
  placeholder = 'Doe',
}: LastNameFieldProps) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand-primary">
      <User size={12} /> Last name
    </label>
    <Input
      type="text"
      autoComplete="family-name"
      value={value}
      onChange={e => onChange(e.target.value)}
      error={!!error}
      placeholder={placeholder}
    />
    {error && <p className="font-mono text-xs text-red-500">{error}</p>}
  </div>
);

export interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  error?: boolean;
  placeholder?: string;
}

export const PasswordField = ({
  value,
  onChange,
  label = 'Password',
  required = true,
  error = false,
  placeholder = '••••••••••••',
}: PasswordFieldProps) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand-primary">
      <Key size={12} /> {label}
    </label>
    <Input
      type="password"
      required={required}
      value={value}
      onChange={e => onChange(e.target.value)}
      error={error}
      placeholder={placeholder}
    />
  </div>
);
