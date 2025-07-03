'use client';
import { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BarChart,
  ShoppingCart,
  FileText,
  Box,
  Wallet,
  Settings,
  Users,
  Bell,
  Menu,
} from 'lucide-react';
import Image from 'next/image';
import { Store } from 'lucide-react';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const lineChartRef = useRef<HTMLCanvasElement | null>(null);
  const doughnutChartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let lineChart: Chart | undefined;
    if (lineChartRef.current) {
      lineChart = new Chart(lineChartRef.current, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Revenue (FCFA)',
              data: [120000, 135000, 140000, 150000, 160000, 145000, 155000],
              borderColor: 'rgb(247, 102, 5)',
              backgroundColor: 'rgba(255,123,0,0.2)',
              tension: 0.3,
            },
            {
              label: 'Profit (FCFA)',
              data: [20000, 25000, 23000, 27000, 30000, 28000, 29000],
              borderColor: 'rgba(16,185,129,1)',
              backgroundColor: 'rgba(16,185,129,0.2)',
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' as const },
          },
        },
      });
    }

    return () => {
      lineChart?.destroy();
    };
  }, []);

  useEffect(() => {
    let doughnutChart: Chart | undefined;
    if (doughnutChartRef.current) {
      doughnutChart = new Chart(doughnutChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Cash', 'Credit Card', 'Mobile Money', 'Bank Transfer'],
          datasets: [
            {
              label: 'Payment Methods',
              data: [40, 25, 20, 15],
              backgroundColor: ['#F97316', '#10B981', '#3B82F6', '#FACC15'],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
        },
      });
    }
    return () => {
      doughnutChart?.destroy();
    };
  }, []);

  const links = [
    { href: '/Dashboard', label: 'Dashboard', icon: Home },
    { href: '/analytics', label: 'Analytics', icon: BarChart },
    { href: '/sales', label: 'Sales', icon: ShoppingCart },
    { href: '/sales-reports', label: 'Sales Reports', icon: FileText },
    { href: '/inventory-reports', label: 'Inventory Reports', icon: Box },
    { href: '/expense-reports', label: 'Expense Reports', icon: Wallet },
    { href: '/system-settings', label: 'System Settings', icon: Settings },
    { href: '/user-management', label: 'User Management', icon: Users },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-orange-600 text-white shadow-lg z-30 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 border-b border-orange-500 px-4">
          <Link href="/Dashboard" className="flex items-center gap-2 text-xl font-bold text-white">
            <Store className="w-6 h-6" />
            <span>STORE</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            ✕
          </button>
        </div>
        <nav className="mt-4">
          <ul className="space-y-1">
            {links.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center px-4 py-2 transition-all duration-200 rounded ${
                    pathname === href
                      ? 'bg-orange-500 font-semibold text-white ring-3 ring-orange-500 shadow-lg'
                      : 'hover:bg-orange-500'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Header */}
      <header className="bg-white shadow-sm z-10 md:ml-64">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="text-orange-700 mr-4 md:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <Link
              href="/"
              className="text-xl font-semibold text-orange-700 hover:text-orange-900 transition-colors"
            >
              ALIMANA
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-orange-700 hover:text-orange-800 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <button className="flex items-center space-x-2">
              <Image
                src="data:image/jpeg;base64,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"
                alt="User"
                width={400}
                height={300}
                className="w-8 h-8 rounded-full"
              />
              <span className="hidden md:inline text-orange-700">Admin</span>
            </button>
          </div>
        </div>
        <div className="px-6 py-2 bg-gray-50 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <i className="fas fa-sync-alt mr-1"></i> Last updated:{' '}
              <span id="lastUpdated">Just now</span>
            </div>
            <div className="flex space-x-2">
              <select className="bg-orange-600 border rounded px-3 py-1 text-white">
                <option>Today</option>
                <option>This Week</option>
                <option selected>This Month</option>
                <option>Custom Range</option>
              </select>
              <button className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-600">
                <i className="fas fa-download mr-1"></i> Export
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="md:ml-64 min-h-screen bg-gray-50 p-6">
        <h1 className="text-2xl font-bold text-orange-700 mb-4">📈 Dashboard</h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Daily Revenue',
              value: '150,000 FCFA',
              change: '+12%',
              color: 'text-green-500',
            },
            {
              title: 'Number of Sales',
              value: '45',
              change: '+5%',
              color: 'text-green-500',
            },
            {
              title: 'Net Profit',
              value: '50,000 FCFA',
              change: '-8%',
              color: 'text-red-500',
            },
            {
              title: 'Daily Expenses',
              value: '30,000 FCFA',
              change: '-15%',
              color: 'text-red-500',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-sm text-gray-500">{card.title}</h2>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className={`${card.color} text-xs`}>{card.change} from yesterday</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sales Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-4">Sales Overview</h3>
            <canvas ref={lineChartRef} />
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Top Selling Products</h3>
              <button className="text-indigo-600 text-sm">View All</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-indigo-800 font-semibold">1</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Bread</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>120 units</span>
                    <span className="mx-2">•</span>
                    <span className="text-green-500">+15%</span>
                  </div>
                </div>
                <div className="text-indigo-600 font-semibold">45,000 FCFA</div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-800 font-semibold">2</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Milk</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>75 units</span>
                    <span className="mx-2">•</span>
                    <span className="text-green-500">+8%</span>
                  </div>
                </div>
                <div className="text-blue-600 font-semibold">30,000 FCFA</div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-800 font-semibold">3</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Butter</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>50 units</span>
                    <span className="mx-2">•</span>
                    <span className="text-red-500">-5%</span>
                  </div>
                </div>
                <div className="text-green-600 font-semibold">25,000 FCFA</div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-yellow-800 font-semibold">4</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Eggs</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>45 units</span>
                    <span className="mx-2">•</span>
                    <span className="text-green-500">+12%</span>
                  </div>
                </div>
                <div className="text-yellow-600 font-semibold">18,000 FCFA</div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-800 font-semibold">5</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Sugar</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>40 units</span>
                    <span className="mx-2">•</span>
                    <span className="text-red-500">-3%</span>
                  </div>
                </div>
                <div className="text-purple-600 font-semibold">15,000 FCFA</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Inventory Alerts */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Inventory Alerts</h3>
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                3 Items
              </span>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Flour', unitsLeft: 2, alertAt: 5 },
                { name: 'Cooking Oil', unitsLeft: 3, alertAt: 10 },
                { name: 'Rice', unitsLeft: 4, alertAt: 8 },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{item.unitsLeft} units left</span>
                      <span className="mx-2">•</span>
                      <span>Alert at {item.alertAt} units</span>
                    </div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-800">
                    <i className="fas fa-plus-circle"></i> Reorder
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Payment Methods</h3>
              <button className="text-indigo-600 text-sm">Details</button>
            </div>
            <canvas ref={doughnutChartRef}></canvas>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-sm text-gray-500">Cash</p>
                <p className="font-semibold">45%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Card</p>
                <p className="font-semibold">35%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mobile</p>
                <p className="font-semibold">20%</p>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Recent Activities</h3>
              <button className="text-indigo-600 text-sm">View All</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <i className="fas fa-shopping-cart text-green-600"></i>
                </div>
                <div>
                  <p className="font-medium">New sale recorded</p>
                  <p className="text-sm text-gray-500">Order #4589 for 12,500 FCFA</p>
                  <p className="text-xs text-gray-400">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <i className="fas fa-truck text-blue-600"></i>
                </div>
                <div>
                  <p className="font-medium">New shipment received</p>
                  <p className="text-sm text-gray-500">15 units of Milk added to inventory</p>
                  <p className="text-xs text-gray-400">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <i className="fas fa-exclamation-triangle text-purple-600"></i>
                </div>
                <div>
                  <p className="font-medium">Low stock alert</p>
                  <p className="text-sm text-gray-500">Flour stock below threshold</p>
                  <p className="text-xs text-gray-400">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <i className="fas fa-times-circle text-red-600"></i>
                </div>
                <div>
                  <p className="font-medium">Expired product</p>
                  <p className="text-sm text-gray-500">2 units of Yogurt expired</p>
                  <p className="text-xs text-gray-400">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
