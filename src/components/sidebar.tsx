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

/**
 * Renders a responsive sidebar navigation component for a Next.js application.
 *
 * The sidebar displays a logo, a close button (on mobile), and a list of navigation links with icons.
 * It highlights the active link based on the current pathname and provides an overlay to close the sidebar on mobile devices.
 * The sidebar remains visible on medium and larger screens, while its visibility on smaller screens is controlled by the `sidebarOpen` prop.
 *
 * @param sidebarOpen - Whether the sidebar is currently visible (used for mobile responsiveness)
 * @param setSidebarOpen - Function to toggle the sidebar's open state
 * @param links - Array of navigation links, each with a label, href, and icon
 *
 * @returns The sidebar navigation UI, or `null` while user state is loading
 */
export default function Sidebar({ sidebarOpen, setSidebarOpen, links }: SidebarProps) {
  const pathname = usePathname();
  const { isLoading } = useUser();

  // Wait for user state to resolve
  if (isLoading) return null;

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
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
        {/* Header with logo and close button */}
        <div className="flex items-center justify-between h-16 border-b border-orange-500 px-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-white">
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
