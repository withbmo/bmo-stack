'use client';

import type { Template } from '@pytholit/ui';
import { Box,LayoutTemplate, Search, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

import { FilterTabButton,Input, TemplateCard } from '@/dashboard/components';
import { DashboardPageHeader,PageLayout } from '@/shared/components/layout';

function toUICemplate(t: {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  stars: string | number;
  isOfficial?: boolean;
}): Template {
  const stars =
    typeof t.stars === 'number'
      ? t.stars
      : parseInt(String(t.stars).replace(/k$/i, '000'), 10) || 0;
  return { ...t, stars, isOfficial: t.isOfficial ?? false };
}

interface TemplatesRouteProps {
  templates: Template[];
}

export const TemplatesRoute = ({ templates }: TemplatesRouteProps) => {
  const [filter, setFilter] = useState<'all' | 'official' | 'community'>('all');
  const [search, setSearch] = useState('');

  const filteredTemplates = templates.filter(t => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag: string) => tag.includes(search.toLowerCase()));

    if (filter === 'official') return matchesSearch && t.isOfficial;
    if (filter === 'community') return matchesSearch && !t.isOfficial;
    return matchesSearch;
  });

  return (
    <PageLayout className="pb-12">
      {/* Header */}
      <DashboardPageHeader
        badge={{ icon: LayoutTemplate, label: 'TEMPLATES' }}
        title={
          <>
            TEMPLATE <span className="text-nexus-muted">STORE</span>
          </>
        }
        subtitle="Jumpstart your next breakthrough with pre-architected foundations. Verified by the Pytholit Core Team and the Community."
      />

      {/* Controls - in page flow, scrolls with content (same as HubPage) */}
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
              placeholder="SEARCH_TEMPLATES..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-bg-surface py-4 pl-24 pr-4 focus:ring-nexus-purple/50 duration-300 placeholder-nexus-gray/40 uppercase tracking-widest"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <FilterTabButton active={filter === 'all'} onClick={() => setFilter('all')}>
              ALL
            </FilterTabButton>
            <FilterTabButton
              active={filter === 'official'}
              onClick={() => setFilter('official')}
              icon={ShieldCheck}
            >
              OFFICIAL
            </FilterTabButton>
            <FilterTabButton
              active={filter === 'community'}
              onClick={() => setFilter('community')}
              icon={Box}
            >
              COMMUNITY
            </FilterTabButton>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <TemplateCard key={template.id} template={toUICemplate(template)} />
        ))}
      </div>
    </PageLayout>
  );
};
