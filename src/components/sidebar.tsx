'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import type { LucideIcon } from 'lucide-react';

export interface SidebarLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  links: SidebarLink[];
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, links }: SidebarProps) {
  const pathname = usePathname();
  const { isLoading } = useUser();

  // Show nothing until user is loaded
  if (isLoading) return null;

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-orange-600 text-white shadow-lg z-30 transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-300 md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 border-b border-orange-500 px-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold">
            <Store className="w-6 h-6" />
            <span>STORE</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white text-xl">
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4">
          <ul className="space-y-1">
            {links.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <li key={href} className="relative">
                  <Link
                    href={href}
                    className={`flex items-center px-4 py-2 rounded transition-all duration-200 ${
                      isActive
                        ? 'bg-orange-500 font-semibold ring-1 ring-orange-500'
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
      </aside>
    </>
  );
}
