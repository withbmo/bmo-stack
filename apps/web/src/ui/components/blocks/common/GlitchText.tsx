import type { ElementType } from 'react';

interface GlitchTextProps {
  text: string;
  as?: ElementType;
  className?: string;
}

export const GlitchText = ({
  text,
  as: Component = 'span' as ElementType,
  className = '',
}: GlitchTextProps) => {
  const autoplayStyle = {
    animation: 'glitch-autoplay 3.5s ease-in-out infinite',
  };
  return (
    <Component className="relative inline-block group">
      <span className={`relative z-10 ${className}`}>{text}</span>
      <span
        className="absolute top-0 left-0 -ml-0.5 translate-x-[2px] text-brand-primary z-0 pointer-events-none group-hover:opacity-70 group-hover:animate-glitch"
        style={autoplayStyle}
      >
        {text}
      </span>
      <span
        className="absolute top-0 left-0 -ml-0.5 -translate-x-[2px] text-brand-accent z-0 pointer-events-none group-hover:opacity-70 group-hover:animate-glitch"
        style={{ ...autoplayStyle, animationDelay: '0.1s' }}
      >
        {text}
      </span>
    </Component>
  );
};
