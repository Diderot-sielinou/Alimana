'use client';
import { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import Link from 'next/link';
import {
  Home,
  // BarChart,
  // ShoppingCart,
  // FileText,
  // Box,
  // Wallet,
  // Settings,
  // Users,
  Bell,
  Menu,
} from 'lucide-react';
import Image from 'next/image';
import Sidebar from '@/components/sidebar';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    { href: '/dashboard/dash', label: 'Dashboard', icon: Home },
    // { href: '/analytics', label: 'Analytics', icon: BarChart },
    // { href: '/sales', label: 'Sales', icon: ShoppingCart },
    // { href: '/sales-reports', label: 'Sales Reports', icon: FileText },
    // { href: '/inventory-reports', label: 'Inventory Reports', icon: Box },
    // { href: '/expense-reports', label: 'Expense Reports', icon: Wallet },
    // { href: '/system-settings', label: 'System Settings', icon: Settings },
    // { href: '/user-management', label: 'User Management', icon: Users },
  ];

  return (
    <>
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} links={links} />

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
                src="https://images.unsplash.com/photo-1644904105846-095e45fca990?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWRtaW5pc3RyYXRvciUyMGltYWdlfGVufDB8fDB8fHww"
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
              <span className="mr-1">🔄</span> Last updated: <span id="lastUpdated">Just now</span>
            </div>
            <div className="flex space-x-2">
              <select className="bg-orange-600 border rounded px-3 py-1 text-white">
                <option value="Today">Today</option>
                <option value="This week">This Week</option>
                <option value="This Month">This Month</option>
                <option value="Custom Range">Custom Range</option>
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
