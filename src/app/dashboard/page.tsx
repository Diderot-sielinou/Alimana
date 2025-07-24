'use client';

import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

export default function DashboardPage() {
  const lineChartRef = useRef<HTMLCanvasElement>(null);
  const doughnutChartRef = useRef<HTMLCanvasElement>(null);

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
          },
        ],
      },
    });
    return () => chart.destroy();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold text-orange-700 dark:text-orange-300 mb-4">📈 Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          {
            title: 'Daily Revenue',
            value: '150,000 FCFA',
            change: '+12%',
            color: 'text-green-500',
          },
          { title: 'Number of Sales', value: '45', change: '+5%', color: 'text-green-500' },
          { title: 'Net Profit', value: '50,000 FCFA', change: '-8%', color: 'text-red-500' },
          { title: 'Daily Expenses', value: '30,000 FCFA', change: '-15%', color: 'text-red-500' },
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
    </>
  );
}
