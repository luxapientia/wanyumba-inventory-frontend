import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Button from './Button.js';

export interface PaginationProps {
  page: number;
  pages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  colorScheme?: 'sky' | 'purple' | 'yellow' | 'indigo';
  showItemsPerPage?: boolean;
  showPageInfo?: boolean;
  limitOptions?: number[];
  className?: string;
}

export default function Pagination({
  page,
  pages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  colorScheme = 'sky',
  showItemsPerPage = true,
  showPageInfo = true,
  limitOptions = [10, 20, 25, 50, 100],
  className = '',
}: PaginationProps) {
  // Don't render if there's only one page and showItemsPerPage is false
  if (pages <= 1 && !showItemsPerPage && !showPageInfo) {
    return null;
  }

  const colorClasses = {
    sky: {
      active: 'bg-gradient-to-r from-sky-500 to-cyan-500',
      hover: 'hover:border-sky-500 hover:bg-sky-50',
      focus: 'focus:ring-sky-500 focus:border-sky-500',
    },
    purple: {
      active: 'bg-gradient-to-r from-purple-500 to-pink-500',
      hover: 'hover:border-purple-500 hover:bg-purple-50',
      focus: 'focus:ring-purple-500 focus:border-purple-500',
    },
    yellow: {
      active: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      hover: 'hover:border-yellow-500 hover:bg-yellow-50',
      focus: 'focus:ring-yellow-500 focus:border-yellow-500',
    },
    indigo: {
      active: 'bg-gradient-to-r from-indigo-500 to-purple-500',
      hover: 'hover:border-indigo-500 hover:bg-indigo-50',
      focus: 'focus:ring-indigo-500 focus:border-indigo-500',
    },
  };

  const colors = colorClasses[colorScheme];

  // Calculate page numbers to display
  const getPageNumbers = () => {
    if (pages <= 5) {
      return Array.from({ length: pages }, (_, i) => i + 1);
    }

    if (page <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (page >= pages - 2) {
      return [pages - 4, pages - 3, pages - 2, pages - 1, pages];
    }

    return [page - 2, page - 1, page, page + 1, page + 2];
  };

  const pageNumbers = getPageNumbers();
  const startItem = Math.min((page - 1) * limit + 1, total);
  const endItem = Math.min(page * limit, total);

  return (
    <div className={`flex flex-col lg:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Left Side: Page Info & Items Per Page */}
      {(showPageInfo || showItemsPerPage) && (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Page Info */}
          {showPageInfo && (
            <div className="text-xs sm:text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{startItem.toLocaleString()}</span> to{' '}
              <span className="font-semibold text-gray-900">{endItem.toLocaleString()}</span> of{' '}
              <span className="font-semibold text-gray-900">{total.toLocaleString()}</span> results
            </div>
          )}

          {/* Items Per Page Selector */}
          {showItemsPerPage && onLimitChange && (
            <div className="flex items-center gap-2">
              <label className="text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap">Per Page:</label>
              <select
                value={limit}
                onChange={(e) => {
                  onLimitChange(Number(e.target.value));
                  onPageChange(1); // Reset to first page when changing limit
                }}
                className={`px-3 py-1.5 border-2 border-gray-300 rounded-lg ${colors.focus} text-xs sm:text-sm font-medium bg-white ${colors.hover} transition-all cursor-pointer`}
              >
                {limitOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Right Side: Pagination Controls */}
      {pages > 1 && (
        <div className="flex items-center gap-2">
          {/* First Page */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(1)}
            disabled={page === 1}
            className={`p-2 rounded-lg border-2 border-gray-300 ${colors.hover} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent transition-all`}
            aria-label="First page"
          >
            <ChevronsLeft size={18} />
          </motion.button>

          {/* Previous Page */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className={`p-2 rounded-lg border-2 border-gray-300 ${colors.hover} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent transition-all`}
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </motion.button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((pageNum) => (
              <motion.button
                key={pageNum}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[40px] h-[40px] px-3 rounded-lg font-semibold transition-all text-sm ${
                  page === pageNum
                    ? `${colors.active} text-white shadow-lg`
                    : `border-2 border-gray-300 ${colors.hover}`
                }`}
                aria-label={`Go to page ${pageNum}`}
                aria-current={page === pageNum ? 'page' : undefined}
              >
                {pageNum}
              </motion.button>
            ))}
          </div>

          {/* Next Page */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(Math.min(pages, page + 1))}
            disabled={page >= pages}
            className={`p-2 rounded-lg border-2 border-gray-300 ${colors.hover} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent transition-all`}
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </motion.button>

          {/* Last Page */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(pages)}
            disabled={page >= pages}
            className={`p-2 rounded-lg border-2 border-gray-300 ${colors.hover} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent transition-all`}
            aria-label="Last page"
          >
            <ChevronsRight size={18} />
          </motion.button>
        </div>
      )}

      {/* Simple Pagination (for pages with only prev/next) */}
      {pages > 1 && pageNumbers.length === 0 && (
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="flex-1 sm:flex-initial min-w-[80px]"
          >
            Previous
          </Button>
          <span className="text-xs sm:text-sm text-gray-600 px-2 sm:px-4 whitespace-nowrap">
            Page {page} of {pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pages}
            className="flex-1 sm:flex-initial min-w-[80px]"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

