import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid3x3, List, Package } from 'lucide-react';
import Button from '../../components/UI/Button.js';
import { Input, Pagination } from '../../components/UI/index.js';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { fetchScrapedPropertiesByPhone, fetchScrapedPropertyTypes } from '../../store/thunks/scrapedPropertiesThunks.js';
import {
  setScrapedPage,
  setScrapedLimit,
  setScrapedFilters,
  setScrapedSorting,
  setScrapedSearch,
} from '../../store/slices/scrapedPropertiesSlice.js';
import DiscoveredPropertyCard from '../../components/Properties/DiscoveredPropertyCard.js';
import PropertyDetailModal from '../../components/Properties/PropertyDetailModal.js';
import type { ScrapedProperty } from '../../api/types.js';

export default function DiscoverMore() {
  const dispatch = useAppDispatch();
  const scrapedPropertiesState = useAppSelector((state: any) => state.scrapedProperties);
  const {
    items: scrapedListings,
    total,
    page,
    limit,
    pages,
    loading,
    filters,
    sortBy,
    sortOrder,
    search,
    propertyTypes, // Get property types from Redux state
  } = scrapedPropertiesState;

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedListing, setSelectedListing] = useState<ScrapedProperty | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch scraped property types on mount
  useEffect(() => {
    dispatch(fetchScrapedPropertyTypes());
  }, [dispatch]);

  // Fetch scraped properties when filters, pagination, or sorting changes
  useEffect(() => {
    dispatch(fetchScrapedPropertiesByPhone());
  }, [
    dispatch,
    page,
    limit,
    sortBy,
    sortOrder,
    filters.source,
    (filters as any).propertyType,
    (filters as any).listingType,
    filters.minPrice,
    filters.maxPrice,
    search,
  ]);

  const handleAddToProperties = async (listing: ScrapedProperty) => {
    // TODO: Implement add to properties functionality
    // This will create a property in the user's inventory
    console.log('Adding property to my properties:', listing);
    // For now, just return a promise that resolves
    return Promise.resolve();
  };

  const handleViewDetails = (listing: ScrapedProperty) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedListing(null);
  };

  const handleSearch = () => {
    dispatch(fetchScrapedPropertiesByPhone());
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setScrapedPage(newPage));
  };

  const handleSourceFilter = (source: string | undefined) => {
    dispatch(setScrapedFilters({ source, page: 1 }));
  };

  const handleSortChange = (sortValue: string) => {
    const [sortBy, sortOrder] = sortValue.split('_');
    dispatch(setScrapedSorting({ sortBy, sortOrder: sortOrder as 'asc' | 'desc' }));
  };

  const handleLimitChange = (newLimit: number) => {
    dispatch(setScrapedLimit(newLimit));
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 bg-gradient-to-br from-gray-50 via-white to-sky-50/30">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-sky-900 to-cyan-900 bg-clip-text text-transparent">
          Discover More
        </h1>
        <p className="text-gray-600 mt-1.5 sm:mt-2 text-sm sm:text-base md:text-lg">
          Properties listed on other platforms matching your phone number
        </p>
      </motion.div>

      {/* Search and Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/50 p-4 sm:p-5 md:p-6 space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <Input
              type="text"
              value={search}
              onChange={(e) => dispatch(setScrapedSearch(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              placeholder="Search by title, description, or address..."
              icon={<Search size={18} className="text-gray-400" />}
              iconPosition="left"
              fullWidth
            />
          </div>
          <Button 
            onClick={handleSearch} 
            leftIcon={<Search size={18} />} 
            variant="primary"
            className="w-full sm:w-auto"
          >
            <span className="hidden sm:inline">Search</span>
            <span className="sm:hidden">Search</span>
          </Button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-3">
          {/* Source Filter */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial min-w-[140px]">
            <Filter size={16} className="text-gray-500 flex-shrink-0" />
            <select
              value={filters.source || ''}
              onChange={(e) => handleSourceFilter(e.target.value || undefined)}
              className="flex-1 px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all text-sm font-medium bg-white"
            >
              <option value="">All Sources</option>
              <option value="jiji">Jiji</option>
              <option value="kupatana">Kupatana</option>
            </select>
          </div>

          {/* Property Type Filter */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial min-w-[140px]">
            <select
              value={(filters as any).propertyType || ''}
              onChange={(e) =>
                dispatch(
                  setScrapedFilters({
                    propertyType: e.target.value || undefined,
                    page: 1,
                  } as any)
                )
              }
              className="flex-1 px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all text-sm font-medium bg-white"
            >
              <option value="">All Property Types</option>
              {propertyTypes.map((type: string) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Listing Type Filter */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial min-w-[140px]">
            <select
              value={(filters as any).listingType || ''}
              onChange={(e) =>
                dispatch(
                  setScrapedFilters({
                    listingType: e.target.value || undefined,
                    page: 1,
                  } as any)
                )
              }
              className="flex-1 px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all text-sm font-medium bg-white"
            >
              <option value="">All Listing Types</option>
              <option value="rent">For Rent</option>
              <option value="sale">For Sale</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <Input
              type="number"
              value={filters.minPrice || ''}
              onChange={(e) =>
                dispatch(
                  setScrapedFilters({
                    minPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                    page: 1,
                  })
                )
              }
              placeholder="Min Price"
              inputSize="sm"
              className="flex-1 sm:w-28"
            />
            <span className="text-gray-500 flex-shrink-0">-</span>
            <Input
              type="number"
              value={filters.maxPrice || ''}
              onChange={(e) =>
                dispatch(
                  setScrapedFilters({
                    maxPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                    page: 1,
                  })
                )
              }
              placeholder="Max Price"
              inputSize="sm"
              className="flex-1 sm:w-28"
            />
          </div>
        </div>
      </motion.div>

      {/* Results Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg border border-gray-200/60 overflow-hidden backdrop-blur-sm"
      >
        {loading ? (
          <div className="text-center py-12 sm:py-16">
            <motion.div
              className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-sky-200 border-t-sky-600"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="mt-4 sm:mt-6 text-gray-600 font-medium text-sm sm:text-base">Loading scraped properties...</p>
          </div>
        ) : scrapedListings.length > 0 ? (
          <div className="p-4 sm:p-6 md:p-8 lg:p-10 space-y-6 sm:space-y-8">
            {/* Results Header with Sort Options */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-gray-200/60">
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap w-full sm:w-auto">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-lg sm:rounded-xl">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">Total Results</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {total} {total === 1 ? 'listing' : 'listings'}
                    </p>
                  </div>
                </div>
                <div className="flex sm:hidden items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200/60 text-xs">
                  <span className="font-medium text-gray-600">Page</span>
                  <span className="font-bold text-gray-900">{page}</span>
                  <span className="text-gray-500">of</span>
                  <span className="font-bold text-gray-900">{pages}</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200/60">
                  <span className="text-sm font-medium text-gray-600">Page</span>
                  <span className="text-sm font-bold text-gray-900">{page}</span>
                  <span className="text-sm text-gray-500">of</span>
                  <span className="text-sm font-bold text-gray-900">{pages}</span>
                </div>
              </div>

              {/* Sort and View Mode Controls */}
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                  <span className="text-xs sm:text-sm font-medium text-gray-600 hidden md:inline">Sort:</span>
                  <select
                    value={`${sortBy}_${sortOrder}`}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all text-xs sm:text-sm font-medium bg-white hover:border-gray-300 cursor-pointer"
                  >
                    <option value="created_at_desc">Newest First</option>
                    <option value="created_at_asc">Oldest First</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="title_asc">Title: A-Z</option>
                    <option value="title_desc">Title: Z-A</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 border-2 border-gray-200 rounded-lg sm:rounded-xl p-1 sm:p-1.5 bg-gray-50 flex-shrink-0">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 sm:p-2.5 rounded-lg transition-all duration-300 ${
                      viewMode === 'grid'
                        ? 'bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-lg shadow-sky-500/30'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-white'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid3x3 size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 sm:p-2.5 rounded-lg transition-all duration-300 ${
                      viewMode === 'list'
                        ? 'bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-lg shadow-sky-500/30'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-white'
                    }`}
                    aria-label="List view"
                  >
                    <List size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Cards Grid/List */}
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8'
                  : 'grid grid-cols-1 gap-4 sm:gap-6'
              }
            >
              {scrapedListings.map((listing: ScrapedProperty, index: number) => (
                <DiscoveredPropertyCard
                  key={listing.rawUrl || index}
                  listing={listing}
                  index={index}
                  viewMode={viewMode}
                  onAddToProperties={handleAddToProperties}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {/* Pagination */}
            {(pages > 1 || true) && (
              <div className="pt-4 sm:pt-6 border-t border-gray-200/60">
                <Pagination
                  page={page}
                  pages={pages}
                  total={total}
                  limit={limit}
                  onPageChange={handlePageChange}
                  onLimitChange={handleLimitChange}
                  colorScheme="sky"
                  showItemsPerPage={true}
                  showPageInfo={false}
                  limitOptions={[10, 20, 50, 100]}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 px-4 sm:px-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4 sm:mb-6"
            >
              <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </motion.div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No Properties Found
            </h3>
            <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto px-4">
              {search || filters.source
                ? 'Try adjusting your search or filters to find more properties'
                : 'No scraped properties available at the moment'}
            </p>
          </div>
        )}
      </motion.div>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        listing={selectedListing}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
