'use client';

import { ArrowUpRight, Brain, FileText, GitBranch, Search, ShieldCheck, Star } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { MotionFade, MotionSlideIn, MotionStagger } from '@/ui';
import { Badge } from '@/ui/shadcn/ui/badge';
import { Button } from '@/ui/shadcn/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/shadcn/ui/card';
import { Input } from '@/ui/shadcn/ui/input';
import { Separator } from '@/ui/shadcn/ui/separator';
import { useHubResources } from '@/shared/routes/hub/hooks/useHubResources';
import type { HubResource, ResourceType } from '@/shared/types';

type FilterType = 'all' | ResourceType;

export function HubRoute({
  withRails = true,
  embedded = false,
}: {
  withRails?: boolean;
  embedded?: boolean;
}) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [query, setQuery] = useState('');
  const { data: resources = [], isLoading } = useHubResources();

  const filteredResources = useMemo(() => {
    const search = query.trim().toLowerCase();
    return resources.filter(resource => {
      const matchesFilter = filter === 'all' || resource.type === filter;
      if (!search) return matchesFilter;

      const haystack = [
        resource.title,
        resource.description,
        resource.author,
        ...resource.tags,
      ]
        .join(' ')
        .toLowerCase();

      return matchesFilter && haystack.includes(search);
    });
  }, [filter, query, resources]);

  return (
    <MotionFade
      as="main"
      className={[
        withRails ? 'rail-borders' : '',
        embedded ? 'w-full' : 'mx-auto w-full max-w-5xl px-6 py-10 md:py-12',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <MotionSlideIn as="section" className="mb-8 space-y-4">
        <Badge variant="outline" className="w-fit">
          <Brain className="size-3" />
          Knowledge Hub
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Verified knowledge. Real patterns.</h1>
        <p className="max-w-2xl text-muted-foreground">
          Browse practical protocols and skill maps shared by builders.
        </p>
      </MotionSlideIn>

      <MotionSlideIn as="section" delay={0.04} className="mb-8">
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

              <div className="flex flex-wrap gap-2">
                <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
                  All
                </Button>
                <Button variant={filter === 'readme' ? 'default' : 'outline'} onClick={() => setFilter('readme')}>
                  <FileText />
                  Protocols
                </Button>
                <Button variant={filter === 'skill' ? 'default' : 'outline'} onClick={() => setFilter('skill')}>
                  <Brain />
                  Skills
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionSlideIn>

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
        <MotionStagger as="section" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map(resource => (
            <MotionFade key={resource.id}>
              <HubResourceCard resource={resource} />
            </MotionFade>
          ))}

          <MotionFade>
            <Card className="flex min-h-[260px] flex-col justify-between border-dashed">
              <CardHeader>
                <CardTitle>Contribute a resource</CardTitle>
                <CardDescription>
                  Share a protocol or skill map with the community.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/dashboard/hub/contribute">
                    Contribute
                    <ArrowUpRight />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </MotionFade>
        </MotionStagger>
      )}
    </MotionFade>
  );
}

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
