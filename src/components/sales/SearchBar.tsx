'use client';

import React from 'react';
import { Search, Barcode, X, Keyboard, Lightbulb } from 'lucide-react';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <input
            type="text"
            id="product-search"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {/* Search Icon */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        <button
          id="scan-btn"
          className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-600 transition"
          type="button"
        >
          <Barcode className="w-5 h-5 mr-2" />
          Scan Barcode
        </button>
      </div>

      {/* Scanner Modal */}
      <div
        id="scanner-modal"
        className="hidden fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
      >
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Barcode Scanner</h3>
            <button id="close-scanner" className="text-gray-500 hover:text-gray-700" type="button">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="barcode-scanner bg-gray-200 rounded-lg p-4 text-center mb-4">
            <Barcode className="w-16 h-16 text-gray-600 mb-2 mx-auto" />
            <p className="text-gray-700">Point camera at barcode</p>
          </div>
          <div className="flex justify-between">
            <button
              id="manual-entry"
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              type="button"
            >
              <Keyboard className="w-5 h-5 mr-2" />
              Manual Entry
            </button>
            <button
              id="flash-toggle"
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              type="button"
            >
              <Lightbulb className="w-5 h-5 mr-2" />
              Flash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
