import { TemplatesRoute } from '@/dashboard/features/templates';
import { getTemplateCatalog } from '@/shared/lib/template-catalog.server';

export default async function TemplatesPage() {
  const templates = await getTemplateCatalog();

  return <TemplatesRoute templates={templates} />;
}
