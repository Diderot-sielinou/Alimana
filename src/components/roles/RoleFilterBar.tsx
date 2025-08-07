'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { RoleDisplay } from '@/types/role';

type Props = {
  onSearch: (query: string, status: 'all' | 'active' | 'inactive') => void;
  filteredRoles: RoleDisplay[];
};

export default function RoleFilterBar({ filteredRoles, onSearch }: Props) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value, status);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'all' | 'active' | 'inactive';
    setStatus(value);
    onSearch(query, value);
  };

  const getEmptyMessage = () => {
    if (status === 'active') return 'No active roles found';
    if (status === 'inactive') return 'No inactive roles found';
    return 'Role not found';
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search role..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex space-x-2">
          <select
            value={status}
            onChange={handleStatusChange}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {filteredRoles.length === 0 && (
        <div className="text-center text-gray-500">
          <p className="mb-2">{getEmptyMessage()}</p>
        </div>
      )}
    </div>
  );
}
