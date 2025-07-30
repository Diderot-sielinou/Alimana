// src/app/dashboard/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import { useShopData } from '@/context/store-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, CreditCard, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { products, cashRegisters, isLoading } = useShopData();
  const [, setIsDarkMode] = useState(false);
  const lineChartRef = useRef<HTMLCanvasElement>(null);
  const doughnutChartRef = useRef<HTMLCanvasElement>(null);

  console.log(`product ${products}`);
  console.log(`cashregister ${cashRegisters}`);

  const stats = [
    {
      title: 'Produits actifs',
      value: products?.filter((p) => p.isActive).length,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Stock total',
      value: products?.reduce((sum, p) => sum + p.quantityInStock, 0),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Caisses actives',
      value: cashRegisters.filter((c) => c.active).length,
      icon: CreditCard,
      color: 'text-primary',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Sessions ouvertes',
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

    const chart = new Chart(lineChartRef.current, {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [
          {
            label: 'Revenu (FCFA)',
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
        labels: ['Cash', 'Carte', 'Mobile Money', 'Virement'],
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

  return (
    <div className="md:ml-64 min-h-screen bg-gray-50 dark:bg-gray-950 px-6 py-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📊 Tableau de bord</h1>
        <p className="text-gray-500 mt-1">Vue densemble de votre boutique</p>
      </div>

      {/* Résumé des revenus */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: 'Revenu journalier',
            value: '150,000 FCFA',
            change: '+12%',
            color: 'text-green-500',
          },
          {
            title: 'Nombre de ventes',
            value: '45',
            change: '+5%',
            color: 'text-green-500',
          },
          {
            title: 'Bénéfice net',
            value: '50,000 FCFA',
            change: '-8%',
            color: 'text-red-500',
          },
          {
            title: 'Dépenses',
            value: '30,000 FCFA',
            change: '-15%',
            color: 'text-red-500',
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow hover:shadow-md transition"
          >
            <h2 className="text-sm text-gray-500 dark:text-gray-400">{card.title}</h2>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            <p className={`${card.color} text-xs`}>{card.change} par rapport à hier</p>
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
        {/* Produits populaires */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Produits populaires</CardTitle>
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
        {/* État des caisses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">État des caisses</CardTitle>
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
        {/* Charts */}{' '}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full ">
          {' '}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
            {' '}
            <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">
              Sales Overview{' '}
            </h3>{' '}
            <canvas ref={lineChartRef} />{' '}
          </div>{' '}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
            {' '}
            <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">
              {' '}
              Payment Methods{' '}
            </h3>{' '}
            <canvas ref={doughnutChartRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
