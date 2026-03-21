'use client';

import { Box, LayoutTemplate, Search, ShieldCheck, Star } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/ui/shadcn/ui/badge';
import { Button } from '@/ui/shadcn/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/shadcn/ui/card';
import { Input } from '@/ui/shadcn/ui/input';
import { DashboardPageHeader, PageLayout } from '@/dashboard/components/layout';
import type { Template } from '@/shared/types';

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
      <DashboardPageHeader
        badge={{ icon: LayoutTemplate, label: 'TEMPLATES' }}
        title="Template Store"
        subtitle="Start faster with curated project templates."
      />

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search templates..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
                All
              </Button>
              <Button variant={filter === 'official' ? 'default' : 'outline'} onClick={() => setFilter('official')}>
                <ShieldCheck />
                Official
              </Button>
              <Button variant={filter === 'community' ? 'default' : 'outline'} onClick={() => setFilter('community')}>
                <Box />
                Community
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="h-full">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={template.isOfficial ? 'default' : 'outline'}>
                  {template.isOfficial ? 'Official' : 'Community'}
                </Badge>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="size-3" />
                  {String(template.stars)}
                </span>
              </div>
              <CardTitle className="text-lg">{template.title}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {template.tags.map(tag => (
                <Badge key={`${template.id}-${tag}`} variant="outline">
                  {tag}
                </Badge>
              ))}
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className="w-full" variant="outline" disabled>
                Use Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
};
