'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrendingUp, DollarSign, CreditCard } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import Chart from 'chart.js/auto';

interface PaymentMethodUsage {
  paymentMethodId: number;
  paymentMethodName: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}

interface PaymentAnalyticsData {
  paymentMethodUsage: PaymentMethodUsage[];
  totalSalesAmount: number;
  totalTransactions: number;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

interface PaymentAnalyticsChartProps {
  storeId: number;
}

export function PaymentAnalyticsChart({ storeId }: PaymentAnalyticsChartProps) {
  const doughnutChartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const [analyticsData, setAnalyticsData] = useState<PaymentAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // days
  const [viewType, setViewType] = useState<'amount' | 'count'>('amount');

  // Color palette for different payment methods
  const colorPalette = [
    '#F97316', // Orange
    '#10B981', // Green
    '#3B82F6', // Blue
    '#FACC15', // Yellow
    '#8B5CF6', // Purple
    '#EF4444', // Red
    '#06B6D4', // Cyan
    '#84CC16', // Lime
  ];

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(dateRange));

      const response = await api.get(`/store/${storeId}/analytics/payments/usage`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });

      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching payment analytics:', error);
      toast('Failed to load payment analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const createChart = () => {
    if (!doughnutChartRef.current || !analyticsData) return;

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = doughnutChartRef.current.getContext('2d');
    if (!ctx) return;

    const data = analyticsData.paymentMethodUsage;
    const labels = data.map((item) => item.paymentMethodName);
    const values = data.map((item) =>
      viewType === 'amount' ? item.totalAmount : item.transactionCount
    );
    const colors = data.map((_, index) => colorPalette[index % colorPalette.length]);

    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverBorderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = data[context.dataIndex];
                if (viewType === 'amount') {
                  return `${context.label}: ${item.totalAmount.toFixed(2)}XAF (${item.percentage.toFixed(1)}%)`;
                } else {
                  return `${context.label}: ${item.transactionCount} transactions (${item.percentage.toFixed(1)}%)`;
                }
              },
            },
          },
        },
        cutout: '60%',
      },
    });
  };

  useEffect(() => {
    fetchAnalyticsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId, dateRange]);

  useEffect(() => {
    if (analyticsData && !isLoading) {
      createChart();
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyticsData, viewType, isLoading]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Payment Methods Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analyticsData || analyticsData.paymentMethodUsage.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Payment Methods Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No payment data available for the selected period
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(analyticsData.totalSalesAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold">
                  {analyticsData.totalTransactions.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Transaction</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(analyticsData.totalSalesAmount / analyticsData.totalTransactions)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Payment Methods Usage</span>
              </CardTitle>
              <CardDescription>
                Distribution of payment methods over the last {dateRange} days
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={viewType}
                onValueChange={(value: 'amount' | 'count') => setViewType(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amount">By Amount</SelectItem>
                  <SelectItem value="count">By Count</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2">
              <div className="relative h-64">
                <canvas ref={doughnutChartRef} />
              </div>
            </div>

            {/* Statistics Table */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Breakdown</h4>
              <div className="space-y-3">
                {analyticsData.paymentMethodUsage.map((item, index) => (
                  <div key={item.paymentMethodId} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colorPalette[index % colorPalette.length] }}
                      />
                      <span className="text-sm font-medium">{item.paymentMethodName}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        {viewType === 'amount'
                          ? formatCurrency(item.totalAmount)
                          : `${item.transactionCount} txns`}
                      </div>
                      <div className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
