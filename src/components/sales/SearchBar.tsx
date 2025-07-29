'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Search, Barcode, X } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  const [scannerVisible, setScannerVisible] = useState(false);
  const scannerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scannerVisible || !scannerRef.current) return;
    if (document.getElementById('scanner')?.hasChildNodes()) return;
    const scanner = new Html5QrcodeScanner('scanner', { fps: 10, qrbox: 250 }, false);

    scanner.render(
      (decodedText) => {
        if (/^[a-zA-Z0-9\-_\s]{4,50}$/.test(decodedText)) {
          onChange(decodedText);
          setScannerVisible(false);
          scanner.clear();
        } else {
          console.log('Not a barcode, ignoring:', decodedText);
        }
      },
      (error) => {
        console.warn('Scan error:', error);
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [scannerVisible, onChange]);

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <input
            type="text"
            id="product-search"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        <button
          onClick={() => setScannerVisible(true)}
          className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition"
          type="button"
        >
          <Barcode className="w-5 h-5 mr-2" />
          Scan Barcode
        </button>
      </div>

      {scannerVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setScannerVisible(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-4 text-center">Scan Barcode</h3>
            <div
              ref={scannerRef}
              id="scanner"
              className="w-full aspect-square bg-gray-200 rounded"
            />
            <p className="text-center text-sm mt-2 text-gray-600">
              Point your camera at the barcode
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
