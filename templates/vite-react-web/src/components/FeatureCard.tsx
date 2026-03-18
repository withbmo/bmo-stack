import type { ReactNode } from "react";

interface FeatureCardProps {
  title: string;
  children: ReactNode;
}

export function FeatureCard({ title, children }: FeatureCardProps) {
  return (
    <article className="card">
      <h2>{title}</h2>
      <p>{children}</p>
    </article>
  );
}
