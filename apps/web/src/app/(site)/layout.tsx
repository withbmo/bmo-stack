import { SiteChrome } from '@/site/components/SiteChrome';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
