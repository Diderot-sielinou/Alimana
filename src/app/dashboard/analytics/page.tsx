'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import { Card } from '@/components/ui/card';
import {
  GetProductPerformance,
  GetSalesOverview,
  GetSalesTrend,
  GetTopProducts,
} from '@/types/get-sales-summary.interface';
import { api } from '@/lib/api';
import { useAuth } from '@/context/auth-context';

interface ChartData {
  salesOverview?: GetSalesOverview[];
  productPerformance?: GetProductPerformance[];
  salesTrend?: GetSalesTrend[];
  topProducts?: GetTopProducts[];
}

export default function AnalyticsPage() {
  const { storeContext } = useAuth();
  const storeId = storeContext?.storeId;
  const [chartData, setChartData] = useState<ChartData>({});
  const [loading, setLoading] = useState(true);

  const revenueChartRef = useRef(null);
  const performanceChartRef = useRef(null);
  const salesTrendChartRef = useRef(null);
  const topProductsChartRef = useRef(null);
  const customerInsightsChartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesOverview, productPerformance, salesTrend, topProducts] = await Promise.all([
          api.get(`store/${storeId}/analytics/sales-overview`).then((res) => res.data),
          api.get(`store/${storeId}/analytics/product-performance`).then((res) => res.data),
          api.get(`store/${storeId}/analytics/sales-trend`).then((res) => res.data),
          api.get(`store/${storeId}/analytics/top-products`).then((res) => res.data),
        ]);

        setChartData({
          salesOverview,
          productPerformance,
          salesTrend,
          topProducts,
        });
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeId]);

  useEffect(() => {
    if (loading || !chartData.salesOverview) return;

    const chartInstances: Chart[] = [];

    // Revenue vs Profit Chart
    if (revenueChartRef.current && chartData.salesOverview) {
      const labels = chartData.salesOverview.map((item) =>
        new Date(item.day).toLocaleDateString('en-US', { weekday: 'short' })
      );
      const revenueData = chartData.salesOverview.map((item) => parseFloat(item.revenue));
      const profitData = chartData.salesOverview.map((item) => parseFloat(item.profit));

      const chart = new Chart(revenueChartRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Revenue',
              data: revenueData,
              borderColor: '#f97316',
              backgroundColor: 'rgba(249, 115, 22, 0.2)',
              tension: 0.3,
            },
            {
              label: 'Profit',
              data: profitData,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              tension: 0.3,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
      chartInstances.push(chart);
    }

    // Product Performance Chart
    if (performanceChartRef.current && chartData.productPerformance) {
      const labels = chartData.productPerformance.map((item) => item.product);
      const data = chartData.productPerformance.map((item) => parseFloat(item.units_sold));

      const chart = new Chart(performanceChartRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Units Sold',
              data,
              backgroundColor: '#3b82f6',
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
      chartInstances.push(chart);
    }

    // Sales Trend Chart
    if (salesTrendChartRef.current && chartData.salesTrend) {
      const labels = chartData.salesTrend.map((item) =>
        new Date(item.day).toLocaleDateString('en-US', { month: 'short' })
      );
      const data = chartData.salesTrend.map((item) => parseFloat(item.total_units_sold));

      const chart = new Chart(salesTrendChartRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Sales Trends',
              data,
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139, 92, 246, 0.2)',
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
      chartInstances.push(chart);
    }

    // Top Products Chart
    if (topProductsChartRef.current && chartData.topProducts) {
      const labels = chartData.topProducts.map((item) => item.product);
      const data = chartData.topProducts.map((item) => parseFloat(item.units_sold));

      const chart = new Chart(topProductsChartRef.current, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              label: 'Top-Selling Products',
              data,
              backgroundColor: [
                '#facc15',
                '#f97316',
                '#10b981',
                '#3b82f6',
                '#8b5cf6',
                '#ec4899',
                '#14b8a6',
                '#f59e0b',
                '#84cc16',
                '#ef4444',
              ],
            },
          ],
        },
      });
      chartInstances.push(chart);
    }

    // Customer Insights Chart (static for now as it's not in your backend)
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
  }, [loading, chartData]);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <main className="flex-1 p-4 ml-0 md:ml-64">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            Analytics Overview
          </h1>
          <div className="flex justify-center items-center h-64">
            <p>Loading analytics data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-4 ml-0 md:ml-64">
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
        </div>
      </main>
    </div>
  );
}
