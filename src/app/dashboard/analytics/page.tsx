'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import { sidebarLinks } from '@/constants/sidebarLinks';
import Sidebar from '@/components/sidebar';
import { Card } from '@/components/ui/card';

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const revenueChartRef = useRef(null);
  const performanceChartRef = useRef(null);
  const salesTrendChartRef = useRef(null);
  const topProductsChartRef = useRef(null);
  const customerInsightsChartRef = useRef(null);

  useEffect(() => {
    const chartInstances: Chart[] = [];

    if (revenueChartRef.current) {
      const chart = new Chart(revenueChartRef.current, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          datasets: [
            {
              label: 'Revenue',
              data: [1200, 1900, 3000, 2500, 4000],
              borderColor: '#f97316',
              backgroundColor: 'rgba(249, 115, 22, 0.2)',
              tension: 0.3,
            },
            {
              label: 'Profit',
              data: [400, 800, 1200, 1000, 1500],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              tension: 0.3,
            },
          ],
        },
      });
      chartInstances.push(chart);
    }

    if (performanceChartRef.current) {
      const chart = new Chart(performanceChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Phones', 'Shoes', 'Books', 'Watches'],
          datasets: [
            {
              label: 'Units Sold',
              data: [45, 32, 28, 40],
              backgroundColor: '#3b82f6',
            },
          ],
        },
      });
      chartInstances.push(chart);
    }

    if (salesTrendChartRef.current) {
      const chart = new Chart(salesTrendChartRef.current, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [
            {
              label: 'Sales Trends',
              data: [300, 500, 400, 600, 750],
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139, 92, 246, 0.2)',
            },
          ],
        },
      });
      chartInstances.push(chart);
    }

    if (topProductsChartRef.current) {
      const chart = new Chart(topProductsChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Product A', 'Product B', 'Product C'],
          datasets: [
            {
              label: 'Top-Selling Products',
              data: [40, 30, 30],
              backgroundColor: ['#facc15', '#f97316', '#10b981'],
            },
          ],
        },
      });
      chartInstances.push(chart);
    }

    if (customerInsightsChartRef.current) {
      const chart = new Chart(customerInsightsChartRef.current, {
        type: 'pie',
        data: {
          labels: ['New', 'Returning'],
          datasets: [
            {
              label: 'Customer Type',
              data: [60, 40],
              backgroundColor: ['#f472b6', '#38bdf8'],
            },
          ],
        },
      });
      chartInstances.push(chart);
    }

    return () => {
      chartInstances.forEach((chart) => chart.destroy());
    };
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} links={sidebarLinks} />

      {/* Main content */}
      <main className="flex-1 p-4 ml-0 md:ml-64">
        {/* Mobile toggle */}
        <div className="mb-4 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-orange-600 text-2xl">
            ☰
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Analytics Overview
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-2">Revenue vs Profit</h2>
            <canvas ref={revenueChartRef} height={180} />
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-2">Product Performance</h2>
            <canvas ref={performanceChartRef} height={180} />
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-2">Sales Trends</h2>
            <canvas ref={salesTrendChartRef} height={180} />
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-2">Top-Selling Products</h2>
            <canvas ref={topProductsChartRef} height={180} />
          </Card>

          <Card className="p-4 md:col-span-2">
            <h2 className="text-lg font-semibold mb-2">Customer Insights</h2>
            <canvas ref={customerInsightsChartRef} height={200} />
          </Card>
        </div>
      </main>
    </div>
  );
}
