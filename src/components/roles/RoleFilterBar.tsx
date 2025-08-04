'use client';

import { Search, Filter } from 'lucide-react';

interface RoleFilterBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  statusFilter: 'all' | 'active' | 'inactive';
  onStatusFilterChange: (status: 'all' | 'active' | 'inactive') => void;
}

export default function RoleFilterBar({
  searchTerm,
  onSearchTermChange,
  statusFilter,
  onStatusFilterChange,
}: RoleFilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search role..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as 'all' | 'active' | 'inactive')}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
