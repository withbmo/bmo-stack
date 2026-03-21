'use client';

import Image from 'next/image';
import { useState } from 'react';

import { MotionFade, MotionSlideIn } from '@/ui';

type SymptomItem = {
  title: string;
  text: string;
  image: string;
  imageAlt: string;
};

const symptoms: SymptomItem[] = [
  {
    title: 'Burning Lap',
    text: 'Your lap is physically burning from your MacBook.',
    image: '/symptoms/burnlaps.png',
    imageAlt: 'Burning laptop visual',
  },
  {
    title: 'Works On My Machine',
    text: "You've said 'it works on my machine' in the last 24 hours.",
    image: '/symptoms/worksonmymachine.png',
    imageAlt: 'Works on my machine visual',
  },
  {
    title: '42 Containers Running',
    text: "You have 42 Docker containers running and don't know what any of them do.",
    image: '/symptoms/42docker.png',
    imageAlt: 'Docker containers visual',
  },
  {
    title: 'Jet Engine Fan',
    text: 'Your fan sounds like a Boeing 747 preparing for takeoff.',
    image: '/symptoms/boeing747.png',
    imageAlt: 'Boeing 747 visual',
  },
];

export function SymptomsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = symptoms[activeIndex] ?? symptoms[0];

  const goPrev = () =>
    setActiveIndex((prev) => (prev - 1 + symptoms.length) % symptoms.length);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % symptoms.length);

  if (!active) return null;

  return (
    <MotionFade as="section" className="border-b bg-transparent">
      <div className="w-full px-6 py-16 md:py-20">
        <MotionSlideIn as="div" className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Symptoms of the Modern Stack
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            If you experience any of the following, you may be suffering from Localhost
            Dependency Syndrome.
          </p>
        </MotionSlideIn>

        <MotionSlideIn as="div" className="mx-auto max-w-5xl">
          <div className="relative px-10 md:px-12">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous symptom"
              className="absolute left-0 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-white/90 bg-white text-black shadow-sm transition-all hover:scale-105"
            >
              <svg viewBox="0 0 24 24" className="size-5 fill-current text-black" aria-hidden="true">
                <path d="M14.7 6.3a1 1 0 0 1 0 1.4L10.41 12l4.3 4.3a1 1 0 0 1-1.42 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.42 0Z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next symptom"
              className="absolute right-0 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-white/90 bg-white text-black shadow-sm transition-all hover:scale-105"
            >
              <svg viewBox="0 0 24 24" className="size-5 fill-current text-black" aria-hidden="true">
                <path d="M9.3 17.7a1 1 0 0 1 0-1.4L13.59 12l-4.3-4.3a1 1 0 0 1 1.42-1.4l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.42 0Z" />
              </svg>
            </button>

            <div className="grid items-center gap-8 md:grid-cols-[320px_1fr]">
              <div className="relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-2xl">
                <Image src={active.image} alt={active.imageAlt} fill className="object-cover" />
              </div>

              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {active.title}
                </p>
                <p className="text-xl font-medium leading-relaxed text-foreground md:text-2xl">
                  {active.text}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  {symptoms.map((_, i) => (
                    <span
                      key={i}
                      className={[
                        'h-1.5 rounded-full transition-all',
                        i === activeIndex ? 'w-8 bg-primary' : 'w-3 bg-border',
                      ].join(' ')}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </MotionSlideIn>
      </div>
    </MotionFade>
  );
}
