import { BlogRoute } from '@/site/routes/blog';
import { getAllBlogPosts } from '@/site/lib/blog';

export default async function BlogPage() {
  const blogPosts = await getAllBlogPosts();
  return <BlogRoute blogPosts={blogPosts} />;
}
