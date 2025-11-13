import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Filter,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Building2,
} from 'lucide-react';
import Button from '../../components/UI/Button.js';
import { AdminPropertyCard } from '../../components/Admin/index.js';
import { useToast } from '../../contexts/index.js';
import propertiesService from '../../api/properties.service.js';
import type { RealEstateProperty, PropertyStatus } from '../../api/types.js';

type FilterStatus = 'ALL' | 'DRAFT' | 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SOLD' | 'RENTED';

export default function ManageProperties() {
  const navigate = useNavigate();
  const toast = useToast();
  const [properties, setProperties] = useState<RealEstateProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  
  // Pagination, sorting, filtering
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<'createdAt' | 'price' | 'title'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [propertyType, setPropertyType] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const status = filterStatus === 'ALL' ? undefined : filterStatus;
      const response = await propertiesService.getProperties({
        status: status as PropertyStatus,
        page,
        limit,
        sortBy,
        sortOrder,
        search: search || undefined,
        propertyType: propertyType || undefined,
      });
      setProperties(response.properties || []);
      setTotalPages(response.pagination?.pages || 1);
      setTotal(response.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Error', 'Failed to fetch properties');
      setProperties([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filterStatus, page, limit, sortBy, sortOrder, search, propertyType]);

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1); // Reset to first page on search
  };

  const handleClearFilters = () => {
    setSearch('');
    setSearchInput('');
    setPropertyType('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                Manage Properties
              </h1>
              <p className="text-gray-600 mt-1">{total} properties in the system</p>
            </div>
            <Button
              onClick={fetchProperties}
              leftIcon={<RefreshCw size={18} />}
              variant="outline"
              disabled={loading}
            >
              Refresh
            </Button>
          </div>

          {/* Status Filters */}
          <div className="mt-6 flex items-center gap-2 flex-wrap">
            <Filter size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Status:</span>
            {(['ALL', 'DRAFT', 'PENDING', 'ACTIVE', 'REJECTED', 'SOLD', 'RENTED'] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filterStatus === status
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Search, Filter & Sort Controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-4 sm:p-6"
        >
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by title, address, or description..."
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              />
            </div>
            <Button onClick={handleSearch} leftIcon={<Search size={18} />}>
              Search
            </Button>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<SlidersHorizontal size={18} />}
              variant="outline"
            >
              Filters
            </Button>
          </div>

          {/* Filters Section */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200"
            >
              {/* Sort By */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as 'createdAt' | 'price' | 'title');
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="price">Price</option>
                  <option value="title">Title</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value as 'asc' | 'desc');
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => {
                    setPropertyType(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">All Types</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                  <option value="office">Office</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button onClick={handleClearFilters} variant="outline" className="w-full">
                  Clear Filters
                </Button>
              </div>
            </motion.div>
          )}

          {/* Active Filters Display */}
          {(search || propertyType) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-600">Active Filters:</span>
              {search && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                  Search: "{search}"
                </span>
              )}
              {propertyType && (
                <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-lg text-sm font-medium capitalize">
                  Type: {propertyType}
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Properties List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
            />
          </div>
        ) : properties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-12 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
              <Building2 size={32} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-gray-600">No properties match your current filters.</p>
          </motion.div>
        ) : (
          <div className="grid gap-5">
            {properties.map((property, index) => (
              <AdminPropertyCard
                key={property.id}
                property={property}
                index={index}
                onClick={() => navigate(`/admin/properties/${property.id}`)}
                showStatusBadge={true}
                borderColor="purple-200/60"
                hoverBorderColor="purple-300/80"
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-4 sm:p-6"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Left Side: Page Info & Items Per Page */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Page Info */}
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{Math.min((page - 1) * limit + 1, total)}</span> to{' '}
                  <span className="font-semibold text-gray-900">{Math.min(page * limit, total)}</span> of{' '}
                  <span className="font-semibold text-gray-900">{total}</span> results
                </div>

                {/* Items Per Page Selector */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-gray-600 whitespace-nowrap">Per Page:</label>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1); // Reset to first page when changing limit
                    }}
                    className="px-3 py-1.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-medium bg-white hover:border-purple-400 transition-all cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              {/* Right Side: Pagination Controls */}
              <div className="flex items-center gap-2">
                {/* First Page */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="p-2 rounded-lg border-2 border-gray-300 hover:border-purple-500 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronsLeft size={18} />
                </motion.button>

                {/* Previous Page */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border-2 border-gray-300 hover:border-purple-500 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronLeft size={18} />
                </motion.button>

                {/* Page Numbers */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <motion.button
                          key={pageNum}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setPage(pageNum)}
                          className={`min-w-[40px] h-[40px] px-3 rounded-lg font-semibold transition-all ${
                            page === pageNum
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                              : 'border-2 border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                          }`}
                        >
                          {pageNum}
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {/* Next Page */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border-2 border-gray-300 hover:border-purple-500 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronRight size={18} />
                </motion.button>

                {/* Last Page */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border-2 border-gray-300 hover:border-purple-500 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronsRight size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

