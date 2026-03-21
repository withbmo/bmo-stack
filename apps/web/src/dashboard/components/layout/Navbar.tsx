'use client';

import { BookOpen, FolderKanban, Layers3, LogOut, Rocket, Settings } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import type { MouseEvent } from 'react';
import { useState } from 'react';

import { useAuth } from '@/shared/auth';
import { FloatingDock } from '@/ui/shadcn/ui/floating-dock';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/shadcn/ui/dialog';
import { Button } from '@/ui/shadcn/ui/button';

/** Floating dock navbar for /dashboard/* */
export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);

  const dockItems = [
    { title: 'Projects', icon: <FolderKanban />, href: '/dashboard', active: isActive('/dashboard') },
    { title: 'Hub', icon: <BookOpen />, href: '/dashboard/hub', active: isActive('/dashboard/hub') },
    {
      title: 'Templates',
      icon: <Layers3 />,
      href: '/dashboard/templates',
      active: isActive('/dashboard/templates'),
    },
    {
      title: 'Deployments',
      icon: <Rocket />,
      href: '/dashboard/deployments',
      active: isActive('/dashboard/deployments'),
    },
    {
      title: 'Settings',
      icon: <Settings />,
      href: '/dashboard/settings',
      active: isActive('/dashboard/settings'),
    },
    {
      title: 'Logout',
      icon: <LogOut />,
      href: '#',
      destructive: true,
      onClick: (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setShowLogoutDialog(true);
      },
    },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/auth/login');
    } finally {
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  return (
    <>
      <nav className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex items-center justify-center px-4">
        <div className="pointer-events-auto flex w-full max-w-6xl items-center justify-center">
          <FloatingDock items={dockItems} />
        </div>
      </nav>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm logout</DialogTitle>
            <DialogDescription>
              You will be signed out of your account and redirected to login.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
