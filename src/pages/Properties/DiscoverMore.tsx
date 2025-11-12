import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid3x3, List } from 'lucide-react';
import Button from '../../components/UI/Button.js';
import { Input } from '../../components/UI/index.js';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { fetchScrapedPropertiesByPhone } from '../../store/thunks/scrapedPropertiesThunks.js';
import {
  setScrapedPage,
  setScrapedLimit,
  setScrapedFilters,
  setScrapedSorting,
  setScrapedSearch,
} from '../../store/slices/scrapedPropertiesSlice.js';
import DiscoveredPropertyCard from '../../components/Properties/DiscoveredPropertyCard.js';
import PropertyDetailModal from '../../components/Properties/PropertyDetailModal.js';
import propertiesService from '../../api/properties.service.js';
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
  } = scrapedPropertiesState;

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [propertyTypesLoading, setPropertyTypesLoading] = useState(false);
  const [selectedListing, setSelectedListing] = useState<ScrapedProperty | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch property types on mount
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      setPropertyTypesLoading(true);
      try {
        const types = await propertiesService.getPropertyTypes();
        setPropertyTypes(types);
      } catch (error) {
        console.error('Failed to fetch property types:', error);
      } finally {
        setPropertyTypesLoading(false);
      }
    };
    fetchPropertyTypes();
  }, []);

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
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-gray-50 via-white to-sky-50/30">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-sky-900 to-cyan-900 bg-clip-text text-transparent">
          Discover More
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Properties listed on other platforms matching your phone number
        </p>
      </motion.div>

      {/* Search and Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
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
          <Button onClick={handleSearch} leftIcon={<Search size={18} />} variant="primary">
            Search
          </Button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Source Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filters.source || ''}
              onChange={(e) => handleSourceFilter(e.target.value || undefined)}
              className="px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all text-sm"
            >
              <option value="">All Sources</option>
              <option value="jiji">Jiji</option>
              <option value="kupatana">Kupatana</option>
            </select>
          </div>

          {/* Property Type Filter */}
          <div className="flex items-center gap-2">
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
              disabled={propertyTypesLoading}
              className="px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="flex items-center gap-2">
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
              className="px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all text-sm"
            >
              <option value="">All Listing Types</option>
              <option value="rent">For Rent</option>
              <option value="sale">For Sale</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="flex items-center gap-2">
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
              className="w-32"
            />
            <span className="text-gray-500">-</span>
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
              className="w-32"
            />
          </div>
        </div>
      </motion.div>

      {/* Results Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden"
      >
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
            <p className="mt-4 text-gray-500">Loading scraped properties...</p>
          </div>
        ) : scrapedListings.length > 0 ? (
          <div className="p-6 space-y-6">
            {/* Results Header with Sort Options */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <p className="text-gray-600">
                  Found <span className="font-semibold text-gray-900">{total}</span>{' '}
                  {total === 1 ? 'listing' : 'listings'}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Page {page} of {pages}</span>
                </div>
              </div>

              {/* Sort and View Mode Controls */}
              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={`${sortBy}_${sortOrder}`}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-3 py-1.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-sky-500 text-sm"
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
                <div className="flex items-center gap-1 border-2 border-gray-200 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-sky-500 text-white'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid3x3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'list'
                        ? 'bg-sky-500 text-white'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    aria-label="List view"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Cards Grid/List */}
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6'
                  : 'grid grid-cols-1 gap-4'
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
            {pages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Items per page:</span>
                  <select
                    value={limit}
                    onChange={(e) => handleLimitChange(parseInt(e.target.value, 10))}
                    className="px-3 py-1.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-sky-500 text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600 px-4">
                    Page {page} of {pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= pages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">
              {search || filters.source
                ? 'No scraped properties found matching your filters'
                : 'No scraped properties found'}
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
