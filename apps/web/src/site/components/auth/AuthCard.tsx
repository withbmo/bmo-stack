interface AuthCardProps {
  children: React.ReactNode;
}

/**
 * Auth form card wrapper with brutalist corner accents.
 */
export const AuthCard = ({ children }: AuthCardProps) => (
  <div className="bg-nexus-dark/95 backdrop-blur border border-nexus-gray p-8 relative overflow-hidden group hover:border-nexus-purple/50 transition-colors nexus-shadow-hover">
    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-nexus-purple" />
    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-nexus-purple" />
    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-nexus-purple" />
    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-nexus-purple" />

    {children}
  </div>
);
