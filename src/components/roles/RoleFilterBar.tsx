'use client';

import { Search, Filter } from 'lucide-react';

interface RoleFilterBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export default function RoleFilterBar({ searchTerm, onSearchTermChange }: RoleFilterBarProps) {
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
          <select className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>roles</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
