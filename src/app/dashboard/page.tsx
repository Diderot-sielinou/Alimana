'use client';

import { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import { Bell, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import Sidebar from '@/components/sidebar';
import { sidebarLinks } from '@/constants/sidebarLinks';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const lineChartRef = useRef<HTMLCanvasElement>(null);
  const doughnutChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    const isDark = theme === 'dark';

    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  useEffect(() => {
    if (!lineChartRef.current) return;

    const chart = new Chart(lineChartRef.current, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Revenue (FCFA)',
            data: [120000, 135000, 140000, 150000, 160000, 145000, 155000],
            borderColor: '#F76605',
            backgroundColor: 'rgba(255,123,0,0.2)',
            tension: 0.3,
          },
          {
            label: 'Profit (FCFA)',
            data: [20000, 25000, 23000, 27000, 30000, 28000, 29000],
            borderColor: '#10B981',
            backgroundColor: 'rgba(16,185,129,0.2)',
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
        },
      },
    });

    return () => chart.destroy();
  }, []);

  useEffect(() => {
    if (!doughnutChartRef.current) return;

    const chart = new Chart(doughnutChartRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Cash', 'Credit Card', 'Mobile Money', 'Bank Transfer'],
        datasets: [
          {
            data: [40, 25, 20, 15],
            backgroundColor: ['#F97316', '#10B981', '#3B82F6', '#FACC15'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
        },
      },
    });

    return () => chart.destroy();
  }, []);

  return (
    <>
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} links={sidebarLinks} />

      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm z-10 md:ml-64 max-w-full pr-2">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Mobile menu */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-orange-700 dark:text-orange-400 mr-4 md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link
              href="/"
              className="text-xl font-semibold text-orange-700 dark:text-orange-300 hover:text-orange-900"
            >
              ALIMANA
            </Link>
          </div>

          {/* Header right */}
          <div className="flex items-center space-x-4">
            <button onClick={toggleDarkMode} title="Toggle dark mode">
              {isDarkMode ? '🌙' : '☀️'}
            </button>
            <button className="text-orange-700 dark:text-orange-300 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center space-x-2">
              <Image
                src="https://images.unsplash.com/photo-1644904105846-095e45fca990?w=500&auto=format&fit=crop&q=60"
                alt="User"
                width={400}
                height={300}
                className="w-8 h-8 rounded-full"
              />
              <span className="hidden md:inline text-orange-700 dark:text-orange-200 text-sm">
                Admin
              </span>
            </div>
          </div>
        </div>

        {/* Filters & Export */}
        <div className="px-6 py-2 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="mr-1">🔄</span> Last updated: Just now
            </p>
            <div className="flex space-x-2">
              <select className="bg-orange-600 text-white px-3 py-1 rounded">
                <option value="Today">Today</option>
                <option value="This week">This Week</option>
                <option value="This Month">This Month</option>
              </select>
              <button className="bg-orange-600 text-white px-3 py-1 rounded text-sm">Export</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen bg-gray-50 dark:bg-gray-950 px-6 py-4">
        <h1 className="text-2xl font-bold text-orange-700 dark:text-orange-300 mb-4">
          📈 Dashboard
        </h1>

        {/* Revenue Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
              className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-sm text-gray-500 dark:text-gray-400">{card.title}</h2>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{card.value}</p>
              <p className={`${card.color} text-xs`}>{card.change} from yesterday</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
            <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">
              Sales Overview
            </h3>
            <canvas ref={lineChartRef} />
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
            <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">
              Payment Methods
            </h3>
            <canvas ref={doughnutChartRef} />
          </div>
        </div>
      </main>
    </>
  );
}
