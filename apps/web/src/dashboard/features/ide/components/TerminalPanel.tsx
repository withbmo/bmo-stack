const terminalNotice = [
  '> Terminal sessions are currently unavailable.',
  '> The previous environment-backed terminal flow has been removed.',
];

export const TerminalPanel = () => {
  return (
    <div className="flex h-1/3 flex-col border-t border-border-default bg-bg-app">
      <div className="flex items-center justify-between border-b border-border-default/30 bg-bg-panel px-4 py-2">
        <div className="flex items-center gap-4">
          <span className="border-b border-brand-primary pb-0.5 font-mono text-xs font-bold text-white">
            TERMINAL
          </span>
          <span className="font-mono text-xs text-text-muted">UNAVAILABLE</span>
        </div>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto p-4 font-mono text-xs text-text-secondary/80">
        {terminalNotice.map(line => (
          <div key={line}>{line}</div>
        ))}
      </div>
    </div>
  );
};
