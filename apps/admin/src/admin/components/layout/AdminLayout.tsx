import { AdminNavbar } from './AdminNavbar';

/**
 * Shell for /admin/*: fixed navbar + main content area.
 */
export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-bg-dashboard text-white font-sans flex flex-col">
      <AdminNavbar />
      <main className="flex-grow min-h-[calc(100vh-4rem)] flex flex-col pt-16">{children}</main>
    </div>
  );
};

