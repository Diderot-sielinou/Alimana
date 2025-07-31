// src/app/dashboard/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import { useShopData } from '@/context/store-context';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, CreditCard, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const {
    products,
    cashRegisters,
    isLoading,
    salesSummary,
    profitSummary,
    revenueSummary,
    salesOverview,
  } = useShopData();
  const [, setIsDarkMode] = useState(false);
  const doughnutChartRef = useRef<HTMLCanvasElement>(null);
  const lineChartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  console.log(`product ${products}`);
  console.log(`cashregister ${cashRegisters}`);

  const { storeContext } = useAuth();
  const storeId = storeContext?.storeId;

  const stats = [
    {
      title: 'Active Products',
      value: products?.filter((p) => p.isActive).length,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Number Of Products',
      value: products?.reduce((sum, p) => sum + p.quantityInStock, 0),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Active Cash Registers',
      value: cashRegisters.filter((c) => c.active).length,
      icon: CreditCard,
      color: 'text-primary',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Open Cash Sessions',
      value: cashRegisters?.filter((c) => c.currentOpenSession?.status === 'open').length,
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  // Charts setup
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  useEffect(() => {
    if (!lineChartRef.current) return;

    const fetchData = async () => {
      try {
        const salesData = salesOverview;
        console.log(salesData);

        // Process data
        const labels = salesData.map((item) =>
          new Date(item.day).toLocaleDateString('fr-FR', { weekday: 'short' })
        );

        const revenueData = salesData.map((item) => parseFloat(item.revenue));
        const profitData = salesData.map((item) => parseFloat(item.profit));

        // Destroy previous chart
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        // Create new chart
        chartInstance.current = new Chart(lineChartRef.current!, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: 'Revenue (FCFA)',
                data: revenueData,
                borderColor: '#F76605',
                backgroundColor: 'rgba(255,123,0,0.2)',
                tension: 0.3,
              },
              {
                label: 'Profit (FCFA)',
                data: profitData,
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
              tooltip: {
                callbacks: {
                  label: (context) =>
                    `${context.dataset.label}: ${(context.raw as number).toLocaleString()} FCFA`,
                },
              },
            },
            scales: {
              y: {
                ticks: {
                  callback: (value) => `${value.toLocaleString()} FCFA`,
                },
              },
            },
          },
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [storeId, salesOverview]);
  useEffect(() => {
    if (!doughnutChartRef.current) return;

    const chart = new Chart(doughnutChartRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Cash', 'Card', 'Mobile Money', 'Bank Transfer'],
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 md:ml-64 min-h-screen bg-gray-50 dark:bg-gray-950 px-6 py-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getTrendColor = (current: number, previous: number): string => {
    return current > previous ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="md:ml-64 min-h-screen bg-gray-50 dark:bg-gray-950 px-6 py-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📊 Dashboard</h1>
        <p className="text-gray-500 mt-1 mb-8 text-center">Summary of Store Performance</p>
      </div>

      {/* Résumé des revenus */}
      <div className="grid grid-cols-1 mb-6 md:grid-cols-3 gap-6">
        {[
          {
            title: `Today's Revenue`,
            value: `${revenueSummary.revenue_today}`,
            change: `${revenueSummary.percentage_change}%`,
            color: getTrendColor(
              revenueSummary.revenue_today || 0,
              revenueSummary.revenue_yesterday || 0
            ),
          },
          {
            title: `Today's sales`,
            value: `${salesSummary.units_today}`,
            change: `${salesSummary.percentage_change}%`,
            color: getTrendColor(salesSummary.units_today || 0, salesSummary.units_yesterday || 0),
          },
          {
            title: 'Bénéfice net',
            value: `${profitSummary.profit_today}`,
            change: `${profitSummary.percentage_change}%`,
            color: getTrendColor(
              profitSummary.profit_today || 0,
              profitSummary.profit_yesterday || 0
            ),
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow hover:shadow-md transition"
          >
            <h2 className="text-sm text-gray-500 dark:text-gray-400">{card.title}</h2>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            <p className={`${card.color} text-xs`}>{card.change} compared to yesterday</p>
          </div>
        ))}
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-5">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value?.toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sections secondaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">
        {/*Colonne 1: Produits Populaires + Sales chart */}
        <div className="flex flex-col gap-6">
          {/* Produits populaires */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Popular Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sellingPrice} XAF</p>
                    </div>
                    <div className="text-left sm:text-right mt-2 sm:mt-0">
                      <p className="font-medium text-gray-900">Stock: {product.quantityInStock}</p>
                      <p className="text-sm text-gray-500">{product.category?.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
            {' '}
            <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">
              Sales Overview{' '}
            </h3>{' '}
            <canvas ref={lineChartRef} className="h-64" />{' '}
          </div>{' '}
        </div>
        {/* Colonne 2: Etat des caisses + Doughnut chart */}
        <div className="flex flex-col gap-6">
          {/* État des caisses */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Cash Registers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cashRegisters.map((register) => (
                  <div
                    key={register.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{register.name}</p>
                      <p className="text-sm text-gray-500">{register.store?.name}</p>
                    </div>
                    <div className="flex mt-2 sm:mt-0 items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          register.currentOpenSession?.status === 'open'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {register.currentOpenSession?.status === 'open' ? 'Ouverte' : 'Fermée'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">
              Payment Methods
            </h3>
            <div className="mx-auto w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96">
              <canvas ref={doughnutChartRef} className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
