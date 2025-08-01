'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, LogOut } from 'lucide-react';
// import { useRouter } from 'next/navigation';
import { sidebarLinks as links } from '@/constants/sidebarLinks';
import { useAuth } from '@/context/auth-context';
import type { LucideIcon } from 'lucide-react';

export interface SidebarLink {
  label: string;
  href: string;
  icon: LucideIcon;
  permissions?: string[];
}

export default function Sidebar() {
  const pathname = usePathname();
  // const router = useRouter();
  const { isLoading, hasPermission, sidebarOpen, setSidebarOpen, logout } = useAuth();

  if (isLoading) return null;

  const filteredLinks = links.filter((link) => {
    if (!link.requiredPermissions || link.requiredPermissions.length === 0) return true;
    return link.requiredPermissions.some((perm: string) => hasPermission(perm));
  });

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-amber-600 text-white shadow-lg z-30 transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-300 md:translate-x-0 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-amber-500">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-white">
            <Store className="w-6 h-6" />
            <span>STORE</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white text-2xl">
            ✕
          </button>
        </div>

        <div className="flex flex-col flex-1 justify-between">
          {/* Nav */}
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
                          ? 'bg-amber-600 font-semibold ring-1 ring-white'
                          : 'hover:bg-amber-500'
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

          <div className="p-4 border-t border-orange-500">
            <button
              onClick={logout}
              className="w-full flex items-center px-3 py-2 rounded-md hover:bg-amber-500 transition text-white font-medium text-sm"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
