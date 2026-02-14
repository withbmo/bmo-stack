'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, FileText, Brain, ArrowUpRight } from 'lucide-react';
import {
  GlitchText,
  ResourceCard,
  Input,
  LoadingState,
  FilterTabButton,
} from '@pytholit/ui';
import { PageLayout, DashboardPageHeader } from '@/shared/components/layout';
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
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-nexus-purple/50 bg-nexus-purple/10 text-nexus-purple font-mono text-xs tracking-widest animate-fade-in">
            <Brain size={12} /> KNOWLEDGE BASE {'//'} DECLASSIFIED
          </div>
          <h1 className="text-5xl md:text-7xl font-sans font-bold mb-6 tracking-tight">
            HUMAN <span className="text-nexus-muted">{'///'}</span> <br />
            <GlitchText
              text="INTELLIGENCE"
              className="text-transparent bg-clip-text bg-gradient-to-r from-white to-nexus-light"
            />
          </h1>
          <p className="font-mono text-nexus-light/60 max-w-2xl text-lg border-l-2 border-nexus-purple pl-6">
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
      <div className="bg-nexus-black/95 backdrop-blur-xl border border-nexus-gray py-4 px-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6 justify-between md:items-center">
          {/* Search */}
          <div className="relative flex-grow max-w-2xl group">
            <div className="absolute left-0 top-0 bottom-0 w-16 flex items-center justify-center border-r border-nexus-gray bg-nexus-gray/5 group-focus-within:bg-nexus-purple/10 group-focus-within:border-nexus-purple transition-all duration-300 z-10">
              <Search
                className="text-nexus-muted group-focus-within:text-nexus-purple transition-colors duration-300"
                size={20}
              />
            </div>

            <Input
              type="text"
              placeholder="SEARCH_DATABASE..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-bg-surface py-4 pl-24 pr-4 focus:ring-nexus-purple/50 duration-300 placeholder-nexus-gray/40 uppercase tracking-widest"
            />

            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-nexus-gray group-focus-within:border-nexus-purple transition-colors duration-300"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-nexus-gray group-focus-within:border-nexus-purple transition-colors duration-300"></div>
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
            className="group relative border-2 border-dashed border-nexus-gray hover:border-nexus-purple flex flex-col items-center justify-center p-8 text-center transition-all cursor-pointer h-full min-h-[300px] bg-black/20 hover:bg-nexus-purple/5"
          >
            <div className="w-16 h-16 bg-nexus-gray/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-nexus-purple transition-colors">
              <ArrowUpRight
                size={32}
                className="text-nexus-muted group-hover:text-white transition-colors"
              />
            </div>
            <h3 className="font-sans font-bold text-xl text-white mb-2">CONTRIBUTE</h3>
            <p className="font-mono text-xs text-nexus-light/50 max-w-xs mb-6 group-hover:text-nexus-light/80">
              Share your verified knowledge. Help others transcend generic AI implementations.
            </p>
            <button className="px-6 py-2 bg-nexus-gray/20 border border-nexus-gray text-xs font-mono text-white group-hover:bg-nexus-purple group-hover:border-nexus-purple transition-all">
              INIT_UPLOAD
            </button>
          </div>
        </div>
      )}
    </PageLayout>
  );
};
