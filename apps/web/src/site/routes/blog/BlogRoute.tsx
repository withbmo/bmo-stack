'use client';

import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { MotionFade, MotionSlideIn, MotionStagger } from '@/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/shadcn/ui/avatar';
import { Badge } from '@/ui/shadcn/ui/badge';
import { Button } from '@/ui/shadcn/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/shadcn/ui/card';
import { Input } from '@/ui/shadcn/ui/input';
import { Separator } from '@/ui/shadcn/ui/separator';
import type { BlogPost } from '@/site/lib/blog';

import { BlogPostView } from '@/site/components/blog/BlogPostView';

export function BlogRoute({ blogPosts }: { blogPosts: BlogPost[] }) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isViewingAll, setIsViewingAll] = useState(false);
  const [query, setQuery] = useState('');

  const featuredPost = useMemo<BlogPost | null>(
    () => blogPosts.find(post => post.featured) ?? blogPosts[0] ?? null,
    []
  );

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return blogPosts;

    return blogPosts.filter(post => {
      const haystack = `${post.title} ${post.description} ${post.category} ${post.author.name}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [query]);

  const latestPosts = useMemo(
    () => filteredPosts.filter(post => !post.featured),
    [filteredPosts]
  );

  const allPosts = useMemo(() => filteredPosts, [filteredPosts]);

  if (selectedPost) {
    return (
      <div className="rail-borders mx-auto w-full max-w-5xl">
        <BlogPostView post={selectedPost} onBack={() => setSelectedPost(null)} />
      </div>
    );
  }

  if (!featuredPost) {
    return (
      <MotionFade as="main" className="rail-borders mx-auto w-full max-w-5xl px-6 py-10 md:py-12">
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No blog posts are available yet.
          </CardContent>
        </Card>
      </MotionFade>
    );
  }

  return (
    <MotionFade as="main" className="rail-borders mx-auto w-full max-w-5xl px-6 py-10 md:py-12">
      <MotionSlideIn as="section" className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Pytholit Blog</h1>
          <p className="mt-2 text-muted-foreground">Insights, tutorials, and product updates.</p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search articles..."
            className="pl-9"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </MotionSlideIn>

      {!isViewingAll ? (
        <>
          <MotionSlideIn
            as="section"
            className="group mb-12 cursor-pointer rounded-xl border bg-card p-6 transition-colors hover:bg-accent/40"
            onClick={() => setSelectedPost(featuredPost)}
          >
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{featuredPost.category}</Badge>
                  <span className="text-sm text-muted-foreground">{featuredPost.date}</span>
                </div>
                <h2 className="text-3xl font-semibold tracking-tight transition-colors group-hover:text-primary md:text-4xl">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground">{featuredPost.description}</p>
                <div className="flex items-center gap-3 pt-2">
                  <Avatar className="size-9">
                    <AvatarImage src={featuredPost.author.avatar} alt={featuredPost.author.name} />
                    <AvatarFallback>{featuredPost.author.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{featuredPost.author.name}</p>
                    <p className="text-xs text-muted-foreground">{featuredPost.author.role}</p>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg border bg-muted/30">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  className="aspect-video h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </MotionSlideIn>

          <Separator className="mb-8" />

          <MotionSlideIn as="section">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-semibold tracking-tight">Latest Articles</h3>
              <Button variant="ghost" className="gap-1" onClick={() => setIsViewingAll(true)}>
                View all
                <ArrowRight />
              </Button>
            </div>

            <BlogCardGrid posts={latestPosts} onSelectPost={setSelectedPost} />
          </MotionSlideIn>
        </>
      ) : (
        <MotionSlideIn as="section">
          <div className="mb-6 flex items-center">
            <Button variant="ghost" className="-ml-3 gap-1" onClick={() => setIsViewingAll(false)}>
              <ArrowLeft />
              Back
            </Button>
            <h2 className="ml-2 text-2xl font-semibold tracking-tight">All Articles</h2>
          </div>
          <BlogCardGrid posts={allPosts} onSelectPost={setSelectedPost} />
        </MotionSlideIn>
      )}
    </MotionFade>
  );
}

function BlogCardGrid({
  posts,
  onSelectPost,
}: {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
}) {
  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          No articles found for your search.
        </CardContent>
      </Card>
    );
  }

  return (
    <MotionStagger as="div" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map(post => (
        <MotionFade key={post.id}>
          <Card
            className="group flex cursor-pointer flex-col overflow-hidden transition-shadow hover:shadow-md"
            onClick={() => onSelectPost(post)}
          >
            <div className="overflow-hidden bg-muted/30">
              <img
                src={post.coverImage}
                alt={post.title}
                className="aspect-video h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            <CardHeader>
              <div className="mb-1 flex items-center gap-2">
                <Badge variant="outline">{post.category}</Badge>
                <span className="text-xs text-muted-foreground">{post.date}</span>
              </div>
              <CardTitle className="line-clamp-2 text-lg group-hover:text-primary">{post.title}</CardTitle>
              <CardDescription className="line-clamp-3">{post.description}</CardDescription>
            </CardHeader>

            <CardFooter className="mt-auto flex items-center gap-2">
              <Avatar className="size-8">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.initials}</AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium">{post.author.name}</p>
            </CardFooter>
          </Card>
        </MotionFade>
      ))}
    </MotionStagger>
  );
}
