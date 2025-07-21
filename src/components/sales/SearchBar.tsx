'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Search, Barcode, X } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'sonner';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  const [scannerVisible, setScannerVisible] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [scannerVisible]);

  const startScanner = async () => {
    setScannerVisible(true);

    try {
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });

      if (permissions.state === 'denied') {
        toast.error(
          'Camera access blocked. Please enable camera permissions in your browser settings to use barcode scanning.'
        );
        setScannerVisible(false);
        return;
      }
    } catch (err) {
      console.warn('Unable to access camera. Please check camera permission settings:', err);
    }

    if (!scannerRef.current) {
      const html5QrCode = new Html5Qrcode('scanner');
      scannerRef.current = html5QrCode;
    }

    try {
      setIsScanning(true);
      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          if (/^\d{8,13}$/.test(decodedText)) {
            onChange(decodedText);
            stopScanner();
          } else {
            console.log('Non-barcode detected, ignoring:', decodedText);
          }
        },
        (errorMessage) => {
          console.log('Scan error:', errorMessage);
        }
      );
    } catch (error) {
      console.error('Unable to start scanner', error);
      toast.error('Impossible to access camera. Verify autorizations.');
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      await scannerRef.current.stop();
      setIsScanning(false);
    }
    setScannerVisible(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop();
      }
    };
  }, [isScanning]);

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
          onClick={startScanner}
          className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition"
          type="button"
        >
          <Barcode className="w-5 h-5 mr-2" />
          Scan Barcode
        </button>
      </div>

      {scannerVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={stopScanner}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-center text-black dark:text-white">
              Scan Barcode
            </h2>
            <div id="scanner" className="w-full aspect-square bg-gray-200 rounded"></div>
            <p className="text-center text-sm mt-2 text-gray-600">
              Point your camera at the barcode
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
