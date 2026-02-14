import { DocsRoute } from '@/site/routes/docs';

export default async function DocsSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <DocsRoute initialSlug={slug} />;
}
