'use client';

import { FilterTabButton, GlitchText, LoadingState, ResourceCard } from '@pytholit/ui/blocks';
import { Input } from '@pytholit/ui/ui';
import { ArrowUpRight, Brain, FileText, Search } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { DashboardPageHeader, PageLayout } from '@/shared/components/layout';

import { useHubResources } from '../hooks/useHubResources';

export const HubRoute = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'readme' | 'skill'>('all');
  const [search, setSearch] = useState('');
  const { data: resources = [], isLoading } = useHubResources();

  /** Hero section only on landing /hub, not on /dashboard/hub */
  const isLandingHub = !pathname?.startsWith('/dashboard');

  const filteredResources = resources.filter(r => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some(t => t.includes(search.toLowerCase()));
    const matchesFilter = filter === 'all' ? true : r.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <PageLayout className="pb-12">
      {/* Header – landing vs dashboard */}
      {isLandingHub ? (
        <div className="mb-16">
          <div className="mb-6 inline-flex items-center gap-2 border border-brand-primary/50 bg-brand-primary/10 px-3 py-1 font-mono text-xs tracking-widest text-brand-primary animate-fade-in">
            <Brain size={12} /> KNOWLEDGE BASE {'//'} DECLASSIFIED
          </div>
          <h1 className="text-5xl md:text-7xl font-sans font-bold mb-6 tracking-tight">
            HUMAN <span className="text-text-muted">{'///'}</span> <br />
            <GlitchText
              text="INTELLIGENCE"
              className="bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent"
            />
          </h1>
          <p className="max-w-2xl border-l-2 border-brand-primary pl-6 font-mono text-lg text-text-secondary/80">
            Verified implementation protocols and skill trees. Because LLMs can&apos;t teach you
            what they haven&apos;t experienced.
          </p>
        </div>
      ) : (
        <DashboardPageHeader
          badge={{ icon: Brain, label: 'HUB' }}
          title="KNOWLEDGE BASE"
          subtitle="Verified implementation protocols and skill trees."
        />
      )}

      {/* Controls - in page flow, scrolls with content */}
      <div className="mb-8 border border-border-default bg-bg-canvas/95 px-6 py-4 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row gap-6 justify-between md:items-center">
          {/* Search */}
          <div className="relative flex-grow max-w-2xl group">
            <div className="absolute bottom-0 left-0 top-0 z-10 flex w-16 items-center justify-center border-r border-border-default bg-border-default/5 transition-all duration-300 group-focus-within:border-brand-primary group-focus-within:bg-brand-primary/10">
              <Search
                className="text-text-muted transition-colors duration-300 group-focus-within:text-brand-primary"
                size={20}
              />
            </div>

            <Input
              type="text"
              placeholder="SEARCH_DATABASE..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-bg-surface py-4 pl-24 pr-4 uppercase tracking-widest placeholder-text-muted/40 duration-300"
            />

            <div className="absolute right-0 top-0 h-2 w-2 border-r border-t border-border-default transition-colors duration-300 group-focus-within:border-brand-primary"></div>
            <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-border-default transition-colors duration-300 group-focus-within:border-brand-primary"></div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <FilterTabButton active={filter === 'all'} onClick={() => setFilter('all')}>
              ALL_DATA
            </FilterTabButton>
            <FilterTabButton
              active={filter === 'readme'}
              onClick={() => setFilter('readme')}
              icon={FileText}
            >
              PROTOCOLS
            </FilterTabButton>
            <FilterTabButton
              active={filter === 'skill'}
              onClick={() => setFilter('skill')}
              icon={Brain}
            >
              SKILLS
            </FilterTabButton>
          </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <LoadingState message="Loading resources..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}

          {/* Call to Action Card */}
          <div
            onClick={() => router.push('/dashboard/hub/contribute')}
            className="group relative flex h-full min-h-[300px] cursor-pointer flex-col items-center justify-center border-2 border-dashed border-border-default bg-bg-canvas/20 p-8 text-center transition-all hover:border-brand-primary hover:bg-brand-primary/5"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-border-default/10 transition-colors group-hover:bg-brand-primary">
              <ArrowUpRight
                size={32}
                className="text-text-muted transition-colors group-hover:text-white"
              />
            </div>
            <h3 className="font-sans font-bold text-xl text-white mb-2">CONTRIBUTE</h3>
            <p className="mb-6 max-w-xs font-mono text-xs text-text-secondary/70 group-hover:text-text-secondary">
              Share your verified knowledge. Help others transcend generic AI implementations.
            </p>
            <button className="border border-border-default bg-border-default/20 px-6 py-2 font-mono text-xs text-white transition-all group-hover:border-brand-primary group-hover:bg-brand-primary">
              INIT_UPLOAD
            </button>
          </div>
        </div>
      )}
    </PageLayout>
  );
};
