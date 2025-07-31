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
    <main className="flex-1 p-6 ml-0 md:ml-64">
      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Sales Report Card */}
        <div className="report-card bg-white rounded-lg shadow-md p-6 transition duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Sales Reports</h3>
            <LineChart className="text-indigo-500 h-5 w-5" />
          </div>
          <p className="text-gray-600 mb-4">
            Generate detailed sales reports by date range, product, or region.
          </p>
          <button
            onClick={() => showModal('salesReportModal')} // <--- FIXED
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Generate Report
          </button>
        </div>

        {/* Inventory Report Card */}
        <div className="report-card bg-white rounded-lg shadow-md p-6 transition duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Inventory Reports</h3>
            <Box className="text-green-500 h-5 w-5" />
          </div>
          <p className="text-gray-600 mb-4">
            View stock levels, low inventory alerts, and product movement reports.
          </p>
          <button
            onClick={() => showModal('inventoryReportModal')}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Generate Report
          </button>
        </div>

        {/* Audit Logs Card */}
        <div className="report-card bg-white rounded-lg shadow-md p-6 transition duration-300 hover:shadow-lg opacity-75 cursor-not-allowed">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-500">Audit Logs</h3>
            <History className="text-gray-400 h-5 w-5" />
          </div>
          <p className="text-gray-400 mb-4">
            Track all system activities, user actions, and data changes.
          </p>
          <div className="relative">
            <button
              className="w-full bg-gray-300 text-gray-500 px-4 py-2 rounded-md transition"
              disabled
            >
              View Logs
            </button>
            <span className="absolute -bottom-6 left-0 text-sm text-gray-500 italic">
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent Reports</h2>
          <button className="text-indigo-600 hover:text-indigo-800 flex items-center">
            <RefreshCw className="mr-1 h-4 w-4" /> Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date Generated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentReports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 h-10 w-10 ${report.iconBg} rounded-full flex items-center justify-center`}
                      >
                        {report.icon}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{report.name}</div>
                        <div className="text-sm text-gray-500">{report.size}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{report.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-3">
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
      {/* You can add other modals for inventoryReportModal here if needed */}
    </main>
  );
}
