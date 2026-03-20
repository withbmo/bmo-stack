interface ToolingCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export const ToolingCheckbox = ({
  checked,
  onChange,
  label,
}: ToolingCheckboxProps) => (
  <label
    className={`group flex cursor-pointer items-center gap-4 border p-4 transition-all ${
      checked
        ? 'border-brand-primary bg-brand-primary/10 shadow-[0_0_18px_rgba(109,40,217,0.2)]'
        : 'border-border-default bg-bg-app hover:border-brand-primary/60'
    }`}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={e => onChange(e.target.checked)}
      className="sr-only"
    />
    <div className="flex-1">
      <span className="block font-mono text-sm text-text-primary">{label}</span>
    </div>
  </label>
);
