// app/dashboard/analytics/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChartBig, TrendingUp, Users } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Analytics Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Users</span>
              <Users className="w-5 h-5 text-amber-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">1,204</p>
            <p className="text-sm text-gray-500">+8.4% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Revenue</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">$12,340</p>
            <p className="text-sm text-gray-500">+5.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Page Views</span>
              <BarChartBig className="w-5 h-5 text-blue-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">28,934</p>
            <p className="text-sm text-gray-500">+12.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for charts or tables */}
      {/* <div className="mt-6 text-gray-600 text-sm border rounded-lg p-4 bg-white shadow-sm">
        Chart or detailed analytics component coming soon...
      </div> */}
    </div>
  );
}
