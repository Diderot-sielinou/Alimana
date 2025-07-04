'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store } from 'lucide-react';

export default function Sidebar({ sidebarOpen, setSidebarOpen, links }) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-64 bg-orange-600 text-white shadow-lg z-30 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 md:translate-x-0`}
    >
      <div className="flex items-center justify-between h-16 border-b border-orange-500 px-4">
        <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-white">
          <Store className="w-6 h-6" />
          <span>STORE</span>
        </Link>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden">
          ✕
        </button>
      </div>
      <nav className="mt-4">
        <ul className="space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href} className="relative">
                <Link
                  href={href}
                  className={`flex items-center px-4 py-2 transition-all duration-200 rounded
                    ${
                      isActive
                        ? 'bg-orange-500 font-semibold text-white ring-2 ring-offset-2 ring-white shadow-lg'
                        : 'hover:bg-orange-500 hover:shadow'
                    }
                  `}
                >
                  {isActive && (
                    <span
                      className="absolute left-0 top-0 h-full w-1 bg-white rounded-r"
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
  );
}
