export const CyberRings = () => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-20 z-0 select-none overflow-hidden flex items-center justify-center">
    <div className="absolute w-full h-full border border-dashed border-brand-primary rounded-full animate-spin-slow"></div>
    <div className="absolute w-[70%] h-[70%] border-2 border-dotted border-border-dim rounded-full animate-spin-reverse-slower"></div>
    <div className="absolute w-[40%] h-[40%] border border-brand-accent rounded-full animate-spin-slow opacity-50"></div>
    <div className="absolute w-full h-[1px] bg-border-dim/50"></div>
    <div className="absolute h-full w-[1px] bg-border-dim/50"></div>
  </div>
);
