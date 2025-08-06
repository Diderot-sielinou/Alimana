'use client';

import { InventoryReportModal } from '@/components/dashboard/InventoryModal';
import { SalesReportModal } from '@/components/dashboard/ReportModal';
import { FileText, LineChart, Box, History, RefreshCw, File, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';

export default function ReportsDashboard() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const recentReports = [
    {
      id: 1,
      name: 'Q2 Sales Summary',
      size: '2.4 MB',
      type: 'Sales',
      date: 'June 30, 2023',
      status: 'Completed',
      icon: <FileText className="text-indigo-600" />,
      iconBg: 'bg-indigo-100',
    },
    {
      id: 2,
      name: 'Inventory Status',
      size: '1.8 MB',
      type: 'Inventory',
      date: 'June 28, 2023',
      status: 'Completed',
      icon: <FileSpreadsheet className="text-green-600" />,
      iconBg: 'bg-green-100',
    },
    {
      id: 3,
      name: 'System Activity Log',
      size: '3.2 MB',
      type: 'Audit',
      date: 'June 25, 2023',
      status: 'Completed',
      icon: <File className="text-purple-600" />,
      iconBg: 'bg-purple-100',
    },
  ];

  const showModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const hideModal = () => {
    setActiveModal(null);
  };

  return (
    <main className="flex-1 md:ml-56 px-4 sm:px-6 lg:px-8 py-6">
      {/* Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Sales Report */}
        <div className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Sales Reports</h3>
            <LineChart className="text-indigo-500 h-5 w-5" />
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Generate detailed sales reports by date range, product, or region.
          </p>
          <button
            onClick={() => showModal('salesReportModal')}
            className="w-full bg-indigo-600 text-white py-2 rounded-md text-sm hover:bg-indigo-700 transition"
          >
            Generate Report
          </button>
        </div>

        {/* Inventory Report */}
        <div className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Inventory Reports</h3>
            <Box className="text-green-500 h-5 w-5" />
          </div>
          <p className="text-gray-600 text-sm mb-4">
            View stock levels, low inventory alerts, and product movement reports.
          </p>
          <button
            onClick={() => showModal('inventoryReportModal')}
            className="w-full bg-green-600 text-white py-2 rounded-md text-sm hover:bg-green-700 transition"
          >
            Generate Report
          </button>
        </div>

        {/* Audit Logs */}
        <div className="bg-gray-100 rounded-lg shadow-sm p-5 opacity-60 cursor-not-allowed">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-500">Audit Logs</h3>
            <History className="text-gray-400 h-5 w-5" />
          </div>
          <p className="text-gray-500 text-sm mb-4">
            Track all system activities, user actions, and data changes.
          </p>
          <div className="relative">
            <button className="w-full bg-gray-300 text-gray-600 py-2 rounded-md text-sm" disabled>
              View Logs
            </button>
            <span className="absolute -bottom-5 left-0 text-xs italic text-gray-500">
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">Recent Reports</h2>
          <button className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm">
            <RefreshCw className="mr-1 h-4 w-4" /> Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4 whitespace-nowrap flex items-center">
                    <div
                      className={`h-10 w-10 flex items-center justify-center rounded-full ${report.iconBg}`}
                    >
                      {report.icon}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">{report.name}</div>
                      <div className="text-gray-500">{report.size}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-700">{report.type}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-500">{report.date}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-700">
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap space-x-2">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900">
                      Download
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                      Share
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'salesReportModal' && <SalesReportModal onClose={hideModal} />}
      {activeModal === 'inventoryReportModal' && <InventoryReportModal onClose={hideModal} />}
    </main>
  );
}
