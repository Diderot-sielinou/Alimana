'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import type { LucideIcon } from 'lucide-react';

// Define type for each link item
export interface SidebarLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

// Define the props for the Sidebar component
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  links: SidebarLink[];
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, links }: SidebarProps) {
  const pathname = usePathname();
  const { user, isLoading } = useUser(); // Must provide user.role

  // Allowed routes for non-admin roles
  const allowedPathsForEmployees = [
    '/dashboard/products',
    '/dashboard/sales',
    '/dashboard/analytics',
    '/dashboard/inventory',
    '/logout',
  ];

  const filteredLinks =
    !isLoading && user?.role !== 'admin'
      ? links.filter((link) => allowedPathsForEmployees.includes(link.href))
      : links;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-orange-600 text-white shadow-lg z-30 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 border-b border-orange-500 px-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-white">
            <Store className="w-6 h-6" />
            <span>STORE</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          <ul className="space-y-1">
            {filteredLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;

              return (
                <li key={href} className="relative">
                  <Link
                    href={href}
                    className={`flex items-center px-4 py-2 transition-all duration-200 rounded relative ${
                      isActive
                        ? 'bg-orange-500 font-semibold text-white ring-1 ring-orange-500'
                        : 'hover:bg-orange-500'
                    }`}
                  >
                    {isActive && (
                      <span
                        className="absolute left-0 top-1 bottom-1 w-1 bg-white rounded-r"
                        aria-hidden="true"
                      />
                    )}
                    <Icon className="w-5 h-5 mr-2" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
