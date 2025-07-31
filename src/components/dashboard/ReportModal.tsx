import { useEffect, useRef, useState } from 'react';
import { X, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth-context';
// import { Progress } from '@/components/ui/progress';

interface ModalProps {
  onClose: () => void;
}

export const SalesReportModal = ({ onClose }: ModalProps) => {
  const { storeContext } = useAuth();
  const storeId = storeContext?.storeId;
  const modalRef = useRef<HTMLDivElement>(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv');
  const [isDownloading, setIsDownloading] = useState(false);
  // const [downloadProgress, setDownloadProgress] = useState(0);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

  // Close modal on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Close modal if user clicks outside
  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && e.target === modalRef.current) {
      onClose();
    }
  };

  // Validate date range
  const validateDates = () => {
    if (!fromDate || !toDate) {
      toast('Please select both start and end dates');
      return false;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      toast('End date must be after start date');
      return false;
    }

    return true;
  };

  // Download report from backend
  const handleDownload = async () => {
    if (!validateDates()) return;

    setIsDownloading(true);
    // setDownloadProgress(0);

    try {
      const endpoint = `${API_BASE_URL}/store/${storeId}/reports/summary/${format}?from=${fromDate}&to=${toDate}`;
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(response.status === 404 ? 'Report not found' : 'Failed to generate report');
      }

      // Get content length for progress tracking
      const contentLength = parseInt(response.headers.get('Content-Length') || '0');
      const reader = response.body?.getReader();
      const chunks: Uint8Array[] = [];
      // let receivedLength = 0;

      if (!reader) throw new Error('No response body');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        // receivedLength += value.length;

        // Update progress if we know the total size
        if (contentLength > 0) {
          // const progress = Math.round((receivedLength / contentLength) * 100);
          // setDownloadProgress(progress);
        }
      }

      // Create blob from all chunks
      const blob = new Blob(chunks as BlobPart[]);
      const url = window.URL.createObjectURL(blob);

      // Generate filename with dates
      const fromStr = new Date(fromDate).toISOString().split('T')[0];
      const toStr = new Date(toDate).toISOString().split('T')[0];
      const filename = `sales-report_${fromStr}_to_${toStr}.${format}`;

      // Trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);

      toast.success(`Your ${format.toUpperCase()} report has been downloaded successfully!`);
    } catch (err) {
      console.error('Download error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to download report');
    } finally {
      setIsDownloading(false);
      // setDownloadProgress(0);
      onClose();
    }
  };
  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClickOutside}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Generate Sales Report</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isDownloading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleDownload();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full border border-orange-600 rounded-md px-3 py-2"
                  max={toDate || undefined}
                  disabled={isDownloading}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full border border-orange-600 rounded-md px-3 py-2"
                  min={fromDate || undefined}
                  disabled={isDownloading}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Format
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormat('csv')}
                    className={`flex-1 flex items-center justify-center gap-2 p-2 border rounded-md ${
                      format === 'csv' ? 'border-orange-600 bg-orange-50' : 'border-gray-300'
                    }`}
                    disabled={isDownloading}
                  >
                    <FileSpreadsheet className="h-5 w-5" />
                    CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('pdf')}
                    className={`flex-1 flex items-center justify-center gap-2 p-2 border rounded-md ${
                      format === 'pdf' ? 'border-orange-600 bg-orange-50' : 'border-gray-300'
                    }`}
                    disabled={isDownloading}
                  >
                    <FileText className="h-5 w-5" />
                    PDF
                  </button>
                </div>
              </div>
            </div>

            {/* {isDownloading && (
              <div className="mb-6 space-y-2">
                <Progress value={downloadProgress} className="h-2" />

                <p className="text-sm text-center text-green-500">
                  Downloading... {downloadProgress}%
                </p>
              </div>
            )} */}

            <div className="flex justify-end space-x-3">
              <Button type="button" onClick={onClose} variant="outline" disabled={isDownloading}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white"
                disabled={isDownloading || !fromDate || !toDate}
              >
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? 'Downloading...' : 'Download Report'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
