import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Grid3x3, List, Plus, Package } from 'lucide-react';
import Button from '../../components/UI/Button.js';
import { Input, ConfirmationModal, Pagination } from '../../components/UI/index.js';
import { useToast } from '../../contexts/index.js';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { fetchProperties, deleteProperty, fetchPropertyTypes } from '../../store/thunks/propertiesThunks.js';
import {
  setPage,
  setLimit,
  setFilters,
  setSorting,
  setSearch,
} from '../../store/slices/propertiesSlice.js';
import PropertyCard from '../../components/Properties/PropertyCard.js';
import type { RealEstateProperty, PropertyStatus } from '../../api/types.js';
import type { RootState } from '../../store/index.js';

export default function Properties() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const propertiesState = useAppSelector((state: RootState) => state.properties);
  const {
    items: properties,
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
  } = propertiesState;

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<RealEstateProperty | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch property types from API on component mount
  useEffect(() => {
    dispatch(fetchPropertyTypes());
  }, [dispatch]);

  // Fetch properties when filters, pagination, or sorting changes
  useEffect(() => {
    dispatch(fetchProperties());
  }, [
    dispatch,
    page,
    limit,
    sortBy,
    sortOrder,
    filters.status,
    filters.propertyType,
    filters.listingType,
    filters.district,
    filters.region,
    filters.minPrice,
    filters.maxPrice,
    filters.minBedrooms,
    search,
  ]);

  const handleSearch = () => {
    dispatch(fetchProperties());
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleLimitChange = (newLimit: number) => {
    dispatch(setLimit(newLimit));
  };

  const handleSortChange = (sortValue: string) => {
    const [newSortBy, newSortOrder] = sortValue.split('_');
    dispatch(setSorting({ sortBy: newSortBy, sortOrder: newSortOrder as 'asc' | 'desc' }));
  };

  const handleStatusFilter = (status: PropertyStatus | undefined) => {
    dispatch(setFilters({ status, page: 1 }));
  };

  const handlePropertyTypeFilter = (propertyType: string | undefined) => {
    dispatch(setFilters({ propertyType, page: 1 }));
  };

  const handleEdit = (property: RealEstateProperty) => {
    navigate(`/properties/${property.id}/edit`);
  };

  const handleDelete = (property: RealEstateProperty) => {
    setPropertyToDelete(property);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;

    try {
      setDeleting(true);
      await dispatch(deleteProperty(propertyToDelete.id)).unwrap();
      setDeleteModalOpen(false);
      setPropertyToDelete(null);
      toast.success('Property Deleted', 'The property has been successfully deleted.');
    } catch (error) {
      console.error('Failed to delete property:', error);
      toast.error('Delete Failed', error instanceof Error ? error.message : 'Failed to delete property. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleViewDetails = (property: RealEstateProperty) => {
    navigate(`/properties/${property.id}`);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-gray-50 via-white to-sky-50/30">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-sky-900 to-cyan-900 bg-clip-text text-transparent">
            My Properties
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Manage your property inventory ({total} {total === 1 ? 'property' : 'properties'})
          </p>
        </div>
        <Button
          as="link"
          to="/properties/new"
          leftIcon={<Plus size={20} />}
          size="lg"
        >
          New Property
        </Button>
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
              onChange={(e) => dispatch(setSearch(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              placeholder="Search by title, description, or address..."
              icon={<Search size={18} className="text-gray-400" />}
              fullWidth
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
            <select
              value={`${sortBy}_${sortOrder}`}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-sky-500 text-sm"
            >
              <option value="createdAt_desc">Newest First</option>
              <option value="createdAt_asc">Oldest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="title_asc">Title: A to Z</option>
              <option value="title_desc">Title: Z to A</option>
              <option value="views_desc">Most Viewed</option>
              <option value="favorites_desc">Most Favorited</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 border-2 border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-sky-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Grid View"
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-sky-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-200">
          <span className="text-sm font-semibold text-gray-700">Quick Filters:</span>
          
          {/* Status Filter */}
          <select
            value={filters.status || ''}
            onChange={(e) => handleStatusFilter(e.target.value as PropertyStatus | undefined)}
            className="px-3 py-1.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-sky-500 text-sm"
          >
            <option value="">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING">Pending</option>
            <option value="ACTIVE">Active</option>
            <option value="REJECTED">Rejected</option>
            <option value="SOLD">Sold</option>
            <option value="RENTED">Rented</option>
          </select>

          {/* Property Type Filter */}
          <select
            value={filters.propertyType || ''}
            onChange={(e) => handlePropertyTypeFilter(e.target.value || undefined)}
            className="px-3 py-1.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-sky-500 text-sm"
          >
            <option value="">All Property Types</option>
            {propertyTypes.map((type: string) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Properties Grid/List */}
      {loading ? (
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Loading properties...</p>
        </div>
      ) : properties.length > 0 ? (
        <div className="space-y-6">
          {/* Properties Display */}
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {properties.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                index={index}
                viewMode={viewMode}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {/* Pagination */}
          {(pages > 1 || true) && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-4 sm:p-6">
              <Pagination
                page={page}
                pages={pages}
                total={total}
                limit={limit}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                colorScheme="sky"
                showItemsPerPage={true}
                showPageInfo={true}
                limitOptions={[10, 20, 50, 100]}
              />
            </div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-12 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="text-center py-16">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Package className="w-20 h-20 mx-auto mb-6 text-gray-300" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {search || filters.status || filters.propertyType
                ? 'No properties found'
                : 'No properties yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {search || filters.status || filters.propertyType
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first property'}
            </p>
            {!search && !filters.status && !filters.propertyType && (
              <Button
                as="link"
                to="/properties/new"
                leftIcon={<Plus size={18} />}
                variant="primary"
              >
                Create First Property
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setPropertyToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Property"
        message={`Are you sure you want to delete "${propertyToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
