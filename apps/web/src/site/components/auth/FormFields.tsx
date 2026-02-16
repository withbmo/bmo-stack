import { Input } from '@pytholit/ui';
import { AtSign,Key, Mail, User } from 'lucide-react';

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
    <label className="font-mono text-xs text-nexus-purple uppercase tracking-wider flex items-center gap-2">
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
    <label className="font-mono text-xs text-nexus-purple uppercase tracking-wider flex items-center gap-2">
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

export interface FullNameFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export const FullNameField = ({
  value,
  onChange,
  error,
  placeholder = 'John Doe',
}: FullNameFieldProps) => (
  <div className="space-y-2">
    <label className="font-mono text-xs text-nexus-purple uppercase tracking-wider flex items-center gap-2">
      <User size={12} /> Full name
    </label>
    <Input
      type="text"
      required
      autoComplete="name"
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
    <label className="font-mono text-xs text-nexus-purple uppercase tracking-wider flex items-center gap-2">
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

export interface OtpFieldProps {
  value: string;
  onChange: (value: string) => void;
  onResend: () => void;
  resendSecondsLeft: number;
  isLoading: boolean;
  email?: string;
  /** Optional ref for the code input (e.g. for focus management) */
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const OtpField = ({
  value,
  onChange,
  onResend,
  resendSecondsLeft,
  isLoading,
  email,
  inputRef,
}: OtpFieldProps) => (
  <div className="space-y-2">
    {email && (
      <p className="font-mono text-xs text-nexus-light/80">
        We sent a code to <span className="text-nexus-purple">{email}</span>
      </p>
    )}
    <label className="font-mono text-xs text-nexus-purple uppercase tracking-wider flex items-center gap-2">
      <Key size={12} /> Verification code
    </label>
    <Input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      required
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="000000"
      className="tracking-widest"
    />
    <p className="font-mono text-[10px] text-nexus-muted">Check your email for the code.</p>
    <button
      type="button"
      onClick={onResend}
      disabled={resendSecondsLeft > 0 || isLoading}
      className="font-mono text-xs text-nexus-muted hover:text-nexus-purple underline decoration-dotted underline-offset-2 transition-colors disabled:opacity-50 disabled:pointer-events-none disabled:no-underline"
    >
      {resendSecondsLeft > 0
        ? `Resend in 0:${String(resendSecondsLeft).padStart(2, '0')}`
        : 'Resend code'}
    </button>
  </div>
);
