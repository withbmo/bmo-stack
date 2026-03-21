import 'server-only';

import fs from 'node:fs/promises';
import path from 'node:path';

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
  initials: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  category: string;
  coverImage: string;
  featured?: boolean;
  author: BlogAuthor;
}

type Frontmatter = {
  title?: string;
  description?: string;
  date?: string;
  category?: string;
  coverImage?: string;
  featured?: boolean;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  authorInitials?: string;
};

const BLOG_DIR = path.join(process.cwd(), 'src/content/blogs');

function parsePrimitive(value: string): string | boolean {
  const trimmed = value.trim();
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  return trimmed.replace(/^["']|["']$/g, '');
}

function parseMdxFile(raw: string): { frontmatter: Frontmatter; content: string } {
  if (!raw.startsWith('---\n')) {
    return { frontmatter: {}, content: raw };
  }

  const end = raw.indexOf('\n---\n', 4);
  if (end === -1) {
    return { frontmatter: {}, content: raw };
  }

  const fmBlock = raw.slice(4, end).trim();
  const content = raw.slice(end + 5).trim();
  const frontmatter: Record<string, string | boolean> = {};

  for (const line of fmBlock.split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1);
    frontmatter[key] = parsePrimitive(value);
  }

  return { frontmatter: frontmatter as Frontmatter, content };
}

function toPost(fileName: string, raw: string): BlogPost {
  const slug = fileName.replace(/\.mdx$/, '');
  const { frontmatter, content } = parseMdxFile(raw);

  return {
    id: slug,
    slug,
    title: frontmatter.title ?? slug.replace(/-/g, ' '),
    description: frontmatter.description ?? '',
    content,
    date: frontmatter.date ?? 'Unknown date',
    category: frontmatter.category ?? 'General',
    coverImage:
      frontmatter.coverImage ??
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1600&auto=format&fit=crop',
    featured: Boolean(frontmatter.featured),
    author: {
      name: frontmatter.authorName ?? 'Pytholit Team',
      role: frontmatter.authorRole ?? 'Contributor',
      avatar: frontmatter.authorAvatar ?? 'https://i.pravatar.cc/100?img=12',
      initials: frontmatter.authorInitials ?? 'PT',
    },
  };
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const entries = await fs.readdir(BLOG_DIR, { withFileTypes: true });
  const mdxFiles = entries.filter(entry => entry.isFile() && entry.name.endsWith('.mdx'));

  const posts = await Promise.all(
    mdxFiles.map(async file => {
      const fullPath = path.join(BLOG_DIR, file.name);
      const raw = await fs.readFile(fullPath, 'utf8');
      return toPost(file.name, raw);
    })
  );

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
