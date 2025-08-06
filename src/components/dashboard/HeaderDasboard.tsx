'use client';

import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { Bell, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useAuth } from '@/context/auth-context';

export default function HeaderDasboard() {
  const { setSidebarOpen, ProfileUser } = useAuth();

  const lineChartRef = useRef<HTMLCanvasElement>(null);
  const doughnutChartRef = useRef<HTMLCanvasElement>(null);

  // Line chart (Sales Overview)
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

  // Doughnut chart (Payment Methods)
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
    <div>
      {' '}
      <header className="bg-white dark:bg-gray-900 shadow-sm z-10 md:ml-64 max-w-full pr-2">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Mobile menu */}
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="text-orange-700 mr-4 md:hidden">
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
            <button className="text-orange-700 dark:text-orange-300 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center space-x-2">
              <Image
                src={
                  ProfileUser?.avatarUrl
                    ? ProfileUser.avatarUrl
                    : 'https://images.unsplash.com/photo-1644904105846-095e45fca990?w=500&auto=format&fit=crop&q=60'
                }
                alt="User"
                width={400}
                height={300}
                className="w-8 h-8 rounded-full"
              />
              <span className="hidden md:inline text-orange-700 dark:text-orange-200 text-sm">
                {ProfileUser?.currentStoreRole.name}
              </span>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
