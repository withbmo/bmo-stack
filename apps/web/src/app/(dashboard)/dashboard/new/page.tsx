import { NewProjectRoute } from '@/dashboard/features/projects/routes/NewProjectRoute';
import { getTemplateCatalog } from '@/shared/lib/template-catalog.server';

export default async function NewProjectPage() {
  const templates = await getTemplateCatalog();

  return <NewProjectRoute templates={templates} />;
}
