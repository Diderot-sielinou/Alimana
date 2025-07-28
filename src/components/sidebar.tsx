'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, LogOut } from 'lucide-react';
<<<<<<< HEAD
import { useRouter } from 'next/navigation';
=======
import { sidebarLinks as links } from '@/constants/sidebarLinks';
import { useAuth } from '@/context/auth-context';
import type { LucideIcon } from 'lucide-react';

>>>>>>> f07724919c5bcbf8b866650bdf9c6ccc55e84f0d
export interface SidebarLink {
  label: string;
  href: string;
  icon: LucideIcon;
  permissions?: string[];
}
<<<<<<< HEAD
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  links: SidebarLink[];
}
export default function Sidebar({ sidebarOpen, setSidebarOpen, links }: SidebarProps) {
  const pathname = usePathname();
  const { isLoading } = useUser();
  const router = useRouter();
  if (isLoading) return null;
  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
=======

export default function Sidebar() {
  const pathname = usePathname();
  const { isLoading, hasPermission, sidebarOpen, setSidebarOpen, logout } = useAuth();

  if (isLoading) return null;

  const filteredLinks = links.filter((link) => {
    if (!link.requiredPermissions || link.requiredPermissions.length === 0) return true;
    return link.requiredPermissions.some((perm) => hasPermission(perm));
  });

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Mobile Overlay */}
>>>>>>> f07724919c5bcbf8b866650bdf9c6ccc55e84f0d
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-orange-600 text-white shadow-lg z-30 transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-300 md:translate-x-0 flex flex-col`}
      >
<<<<<<< HEAD
        <div className="flex flex-col h-full justify-between">
          {/* Top: Logo and Navigation */}
          <div>
            {/* Header */}
            <div className="flex items-center justify-between h-16 border-b border-orange-500 px-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-xl font-bold text-white"
              >
                <Store className="w-6 h-6" />
                <span>STORE</span>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden text-2xl">
                ✕
              </button>
            </div>
            {/* Navigation */}
            <nav className="mt-4">
              <ul className="space-y-1">
                {links.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href;
                  return (
                    <li key={href} className="relative">
                      <Link
                        href={href}
                        className={`flex items-center px-4 py-2 transition-all duration-200 rounded ${
                          isActive
                            ? 'bg-orange-500 font-semibold text-white ring-1 ring-orange-500'
                            : 'hover:bg-orange-500'
                        }`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1 bottom-1 w-1 bg-white rounded-r" />
                        )}
                        <Icon className="w-5 h-5 mr-2" />
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
          {/* Bottom: Logout */}
          <div className="px-4 py-4 border-t border-orange-500">
=======
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-orange-500">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-white">
            <Store className="w-6 h-6" />
            <span>STORE</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white text-2xl">
            ✕
          </button>
        </div>

        {/* Nav + Logout Zone */}
        <div className="flex flex-col flex-1 justify-between">
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {filteredLinks.map(({ href, label, icon: Icon }) => {
                const isActive = isLinkActive(href);
                return (
                  <li key={href} className="relative">
                    <Link
                      href={href}
                      className={`flex items-center px-4 py-2 rounded-md transition-all duration-200 ${
                        isActive
                          ? 'bg-orange-500 font-semibold ring-1 ring-white'
                          : 'hover:bg-orange-500'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1 bottom-1 w-1 bg-white rounded-r" />
                      )}
                      <Icon className="w-5 h-5 mr-2" />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout en bas */}
          <div className="p-4 border-t border-orange-500">
>>>>>>> f07724919c5bcbf8b866650bdf9c6ccc55e84f0d
            <button
              onClick={logout}
              className="w-full flex items-center px-3 py-2 rounded-md hover:bg-orange-500 transition text-white font-medium text-sm"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
