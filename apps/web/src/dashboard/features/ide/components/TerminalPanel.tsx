const terminalNotice = [
  '> Terminal sessions are currently unavailable.',
  '> The previous environment-backed terminal flow has been removed.',
];

export const TerminalPanel = () => {
  return (
    <div className="h-1/3 border-t border-nexus-gray flex flex-col bg-nexus-black">
      <div className="flex items-center justify-between px-4 py-2 bg-nexus-dark border-b border-nexus-gray/30">
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono font-bold text-white border-b border-nexus-purple pb-0.5">
            TERMINAL
          </span>
          <span className="text-xs font-mono text-nexus-muted">UNAVAILABLE</span>
        </div>
      </div>
      <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1 text-nexus-light/80">
        {terminalNotice.map(line => (
          <div key={line}>{line}</div>
        ))}
      </div>
    </div>
  );
};
