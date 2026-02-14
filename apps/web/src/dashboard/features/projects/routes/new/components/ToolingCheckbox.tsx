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
    className={`group flex items-center gap-4 p-4 border cursor-pointer transition-all ${
      checked
        ? 'border-nexus-purple bg-nexus-purple/10 shadow-[0_0_18px_rgba(109,40,217,0.2)]'
        : 'border-nexus-gray bg-[#080808] hover:border-nexus-purple/60'
    }`}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="sr-only"
    />
    <div className="flex-1">
      <span className="font-mono text-sm text-white block">{label}</span>
    </div>
  </label>
);
