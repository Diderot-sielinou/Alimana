'use client';

import { useAuth } from '@/context/auth-context';
import { hasPermission } from '@/lib/auth';
import { Permission, UserRole } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown } from 'lucide-react';

export function StatsOverview() {
  const { user } = useAuth();

  if (!user) return null;

  // Different stats based on user role
  const getStatsForRole = () => {
    const baseStats = [];

    if (hasPermission(user, Permission.VIEW_SALES)) {
      baseStats.push({
        title: user.role === UserRole.CASHIER ? "Today's Sales" : 'Total Revenue',
        value: user.role === UserRole.CASHIER ? '$1,234.56' : '$45,231.89',
        change: '+20.1%',
        trend: 'up' as const,
        icon: DollarSign,
      });
    }

    if (hasPermission(user, Permission.VIEW_ORDERS)) {
      baseStats.push({
        title: user.role === UserRole.CASHIER ? 'Orders Processed' : 'Total Orders',
        value: user.role === UserRole.CASHIER ? '23' : '2,350',
        change: '+180.1%',
        trend: 'up' as const,
        icon: ShoppingCart,
      });
    }

    if (hasPermission(user, Permission.VIEW_PRODUCTS)) {
      baseStats.push({
        title: 'Products',
        value: '12,234',
        change: '+19%',
        trend: 'up' as const,
        icon: Package,
      });
    }

    if (hasPermission(user, Permission.VIEW_ANALYTICS) && user.role !== UserRole.CASHIER) {
      baseStats.push({
        title: 'Active Customers',
        value: '573',
        change: '+201',
        trend: 'up' as const,
        icon: Users,
      });
    }

    return baseStats;
  };

  const stats = getStatsForRole();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="flex items-center text-xs text-gray-600 mt-1">
              {stat.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                {stat.change}
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
