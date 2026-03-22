'use client';

import { ArrowUpRight, Brain, FileText, GitBranch, Search, ShieldCheck, Star } from 'lucide-react';
import { useMemo, useState } from 'react';

import { DashboardPageHeader, PageLayout } from '@/dashboard/components/layout';
import { Badge } from '@/ui/shadcn/ui/badge';
import { Button } from '@/ui/shadcn/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/shadcn/ui/card';
import { Input } from '@/ui/shadcn/ui/input';
import { Separator } from '@/ui/shadcn/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/ui/shadcn/ui/tabs';

import { useHubResources } from '../hooks/useHubResources';
import type { HubResource, ResourceType } from '@/shared/types';

type FilterType = 'all' | ResourceType;

export const HubRoute = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [query, setQuery] = useState('');
  const { data: resources = [], isLoading } = useHubResources();

  const filteredResources = useMemo(() => {
    const search = query.trim().toLowerCase();
    return resources.filter(resource => {
      const matchesFilter = filter === 'all' || resource.type === filter;
      if (!search) return matchesFilter;

      const haystack = [resource.title, resource.description, resource.author, ...resource.tags]
        .join(' ')
        .toLowerCase();

      return matchesFilter && haystack.includes(search);
    });
  }, [filter, query, resources]);

  return (
    <PageLayout className="pb-12">
      <DashboardPageHeader
        badge={{ icon: Brain, label: 'Hub' }}
        title="Knowledge Base"
        subtitle="Verified implementation protocols and skill maps."
      />

      <section className="mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-xl">
                <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search resources..."
                  className="pl-9"
                />
              </div>

              <Tabs
                value={filter}
                onValueChange={value => setFilter(value as FilterType)}
                className="w-full md:w-auto"
              >
                <TabsList className="w-full md:w-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="readme">
                    <FileText />
                    Protocols
                  </TabsTrigger>
                  <TabsTrigger value="skill">
                    <Brain />
                    Skills
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator className="mb-8" />

      {isLoading ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">Loading resources...</CardContent>
        </Card>
      ) : filteredResources.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No resources match your current filters.
          </CardContent>
        </Card>
      ) : (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map(resource => (
            <HubResourceCard key={resource.id} resource={resource} />
          ))}

          <Card className="flex min-h-[260px] flex-col justify-between border-dashed">
            <CardHeader>
              <CardTitle>Contribute a resource</CardTitle>
              <CardDescription>Share a practical protocol or skill map with the community.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <a href="/dashboard/hub/contribute">
                  Contribute
                  <ArrowUpRight />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </section>
      )}
    </PageLayout>
  );
};

function HubResourceCard({ resource }: { resource: HubResource }) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant={resource.type === 'readme' ? 'secondary' : 'outline'}>
            {resource.type === 'readme' ? 'Protocol' : 'Skill'}
          </Badge>
          <span className="text-xs text-muted-foreground">{resource.updatedAt}</span>
        </div>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-6">{resource.title}</CardTitle>
          {resource.verified ? <ShieldCheck className="size-4 text-primary" /> : null}
        </div>
        <CardDescription>{resource.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {resource.tags.map(tag => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between text-sm text-muted-foreground">
        <span>{resource.author}</span>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <Star className="size-3.5" />
            {resource.stars}
          </span>
          <span className="inline-flex items-center gap-1">
            <GitBranch className="size-3.5" />
            {resource.forks}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
