'use client';
import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import Link from 'next/link';
import { Bell, Home, BarChart, ShoppingCart, Settings } from 'lucide-react';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const lineChartRef = useRef<HTMLCanvasElement | null>(null);
  const doughnutChartRef = useRef<HTMLCanvasElement | null>(null);
  const barChartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Line Chart
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
              borderColor: 'rgba(99,102,241,1)',
              backgroundColor: 'rgba(99,102,241,0.2)',
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

    // Doughnut Chart
    let doughnutChart: Chart | undefined;
    if (doughnutChartRef.current) {
      doughnutChart = new Chart(doughnutChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Bread', 'Milk', 'Butter', 'Eggs', 'Sugar'],
          datasets: [
            {
              data: [45, 30, 25, 18, 15],
              backgroundColor: [
                'rgba(99,102,241,0.8)',
                'rgba(16,185,129,0.8)',
                'rgba(251,191,36,0.8)',
                'rgba(239,68,68,0.8)',
                'rgba(184,13,133,0.8)',
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' as const },
          },
        },
      });
    }

    // Bar Chart
    let barChart: Chart | undefined;
    if (barChartRef.current) {
      barChart = new Chart(barChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Bread', 'Milk', 'Butter', 'Eggs', 'Sugar'],
          datasets: [
            {
              label: 'Units Sold',
              data: [120, 75, 50, 45, 40],
              backgroundColor: 'rgba(99,102,241,0.8)',
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
          },
        },
      });
    }

    return () => {
      lineChart?.destroy();
      doughnutChart?.destroy();
      barChart?.destroy();
    };
  }, []);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-orange-600 text-white shadow-lg z-30 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 border-b border-orange-500 px-4">
          <h1 className="text-xl font-bold">ALIMANA</h1>
          <button onClick={() => setSidebarOpen(false)} className="text-white bg- mr-4 md:hidden">
            ✕
          </button>
        </div>
        <nav className="mt-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/"
                className="flex items-center px-4 py-2 hover:bg-orange-500 transition-colors"
              >
                <Home className="w-5 h-5 mr-2" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/analytics"
                className="flex items-center px-4 py-2 hover:bg-orange-500 transition-colors"
              >
                <BarChart className="w-5 h-5 mr-2" />
                Analytics
              </Link>
            </li>
            <li>
              <Link
                href="/sales"
                className="flex items-center px-4 py-2 hover:bg-orange-500 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Sales
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className="flex items-center px-4 py-2 hover:bg-orange-500 transition-colors"
              >
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <header className="bg-white shadow-sm z-10">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="text-white mr-4 md:hidden">
              <i className="fas fa-bars text-xl"></i>
            </button>
            <Link
              href="/"
              className="text-xl font-semibold text-orange-700 hover:text-white transition-colors"
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
              <img src="/avatar.png" alt="User" className="w-8 h-8 rounded-full" />
              <span className="hidden md:inline text-orange-700">Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <div className="md:ml-64 min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-orange-700 mb-6">📈 Dashboard</h1>
        {/* tes cards et charts */}
      </div>
    </>
  );
}
