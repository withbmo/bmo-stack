import { FeatureCard } from "@/components/FeatureCard";
import { env } from "@/config/env";
import { homeSections } from "@/features/home/content";
import { projectCopy } from "@/lib/project";

export function HeroSection() {
  return (
    <>
      <header className="hero">
        <p className="eyebrow">{projectCopy.eyebrow}</p>
        <h1>{projectCopy.headline}</h1>
        <p className="lede">{projectCopy.description}</p>
        <p className="meta">App name: {env.appName}</p>
      </header>

      <section className="grid">
        {homeSections.map((section) => (
          <FeatureCard key={section.title} title={section.title}>
            {section.description}
          </FeatureCard>
        ))}
      </section>
    </>
  );
}
