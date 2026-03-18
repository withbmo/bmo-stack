import { SectionCard } from "@/components/section-card";
import { env } from "@/config/env";
import { homePillars } from "@/features/home/content";
import { projectCopy } from "@/lib/project";

export function HeroSection() {
  return (
    <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-10 px-6 py-24">
      <div className="space-y-6">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
          {projectCopy.eyebrow}
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
          {projectCopy.headline}
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-300">{projectCopy.description}</p>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">App name: {env.appName}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {homePillars.map((pillar) => (
          <SectionCard key={pillar.title} title={pillar.title}>
            {pillar.description}
          </SectionCard>
        ))}
      </div>
    </section>
  );
}
