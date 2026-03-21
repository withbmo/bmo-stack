'use client';

import { ArrowLeft, Share2 } from 'lucide-react';
import { toast } from '@/ui/system';

import { MotionFade, MotionSlideIn } from '@/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/shadcn/ui/avatar';
import { Badge } from '@/ui/shadcn/ui/badge';
import { Button } from '@/ui/shadcn/ui/button';
import { Separator } from '@/ui/shadcn/ui/separator';
import type { BlogPost } from '@/site/lib/blog';

interface BlogPostViewProps {
  post: BlogPost;
  onBack: () => void;
}

function renderContent(content: string) {
  return content.split('\n\n').map((block, index) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('# ')) {
      return (
        <h2 key={index} className="mt-10 text-3xl font-semibold tracking-tight">
          {trimmed.replace('# ', '')}
        </h2>
      );
    }

    if (trimmed.startsWith('## ')) {
      return (
        <h3 key={index} className="mt-8 text-2xl font-semibold tracking-tight">
          {trimmed.replace('## ', '')}
        </h3>
      );
    }

    if (trimmed.startsWith('- ')) {
      return (
        <ul key={index} className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
          {trimmed.split('\n').map((item, itemIndex) => (
            <li key={`${index}-${itemIndex}`}>{item.replace('- ', '')}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={index} className="mt-4 leading-7 text-muted-foreground">
        {trimmed}
      </p>
    );
  });
}

export function BlogPostView({ post, onBack }: BlogPostViewProps) {
  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareData = {
      title: post.title,
      text: post.description,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard.');
    } catch {
      toast.error('Unable to share this post.');
    }
  };

  return (
    <MotionFade as="article" className="mx-auto w-full max-w-5xl px-6 py-10 md:py-12">
      <MotionSlideIn as="div">
        <Button variant="ghost" className="-ml-3 mb-8" onClick={onBack}>
          <ArrowLeft />
          Back to articles
        </Button>
      </MotionSlideIn>

      <MotionSlideIn as="div" delay={0.04} className="space-y-6">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{post.category}</Badge>
          <span className="text-sm text-muted-foreground">{post.date}</span>
        </div>

        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">{post.title}</h1>
        <p className="max-w-3xl text-lg text-muted-foreground">{post.description}</p>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">{post.author.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Share post" onClick={handleShare}>
              <Share2 />
            </Button>
          </div>
        </div>
      </MotionSlideIn>

      <MotionSlideIn as="div" delay={0.08} className="mt-10 overflow-hidden rounded-xl border bg-muted/40">
        <img
          src={post.coverImage}
          alt={post.title}
          className="aspect-video h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      </MotionSlideIn>

      <MotionSlideIn as="div" delay={0.12} className="mt-10">
        {renderContent(post.content)}
      </MotionSlideIn>

      <Separator className="my-10" />

      <MotionSlideIn
        as="div"
        delay={0.16}
        className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-5"
      >
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs text-muted-foreground">Written by</p>
            <p className="font-medium">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">{post.author.role}</p>
          </div>
        </div>
        <Button variant="outline">View Profile</Button>
      </MotionSlideIn>
    </MotionFade>
  );
}
