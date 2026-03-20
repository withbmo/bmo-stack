interface AuthCardProps {
  children: React.ReactNode;
}

/**
 * Auth form card wrapper with brutalist corner accents.
 */
export const AuthCard = ({ children }: AuthCardProps) => (
  <div className="group relative overflow-hidden border border-border-default bg-bg-panel/95 p-8 backdrop-blur transition-colors hover:border-brand-primary/50 offset-shadow-hover">
    <div className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-brand-primary" />
    <div className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-brand-primary" />
    <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-brand-primary" />
    <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-brand-primary" />

    {children}
  </div>
);
