import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Building2,
  BedDouble,
  Bath,
  Square,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Phone,
  Mail,
  User,
  Edit,
  Trash2,
  Car,
  TreePine,
  Shield,
  Waves,
  Wifi,
  Tv,
  AirVent,
  UtensilsCrossed,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  X,
  Globe,
  AlertCircle,
} from 'lucide-react';
import Button from '../../components/UI/Button.js';
import { ConfirmationModal } from '../../components/UI/index.js';
import { useToast } from '../../contexts/index.js';
import propertiesService from '../../api/properties.service.js';
import type { RealEstateProperty, PropertyStatus } from '../../api/types.js';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [property, setProperty] = useState<RealEstateProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setError('Property ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await propertiesService.getPropertyById(id);
        setProperty(data);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch property');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const formatPrice = () => {
    if (!property?.price) return 'Price on request';
    const currency = property.currency || 'TZS';
    return `${currency} ${property.price.toLocaleString()}`;
  };

  const getStatusBadgeColor = (status: PropertyStatus) => {
    const colors = {
      DRAFT: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/30',
      PENDING: 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg shadow-yellow-500/30',
      ACTIVE: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30',
      REJECTED: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30',
      SOLD: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30',
      RENTED: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/30',
    };
    return colors[status] || colors.DRAFT;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getFeatureIcon = (key: string) => {
    const iconMap: Record<string, typeof Car> = {
      parking: Car,
      garden: TreePine,
      security: Shield,
      swimmingPool: Waves,
      wifi: Wifi,
      tv: Tv,
      airConditioning: AirVent,
      kitchen: UtensilsCrossed,
      gym: Dumbbell,
    };
    return iconMap[key.toLowerCase()] || Building2;
  };

  const getFeatureColor = (key: string) => {
    const colorMap: Record<string, string> = {
      parking: 'blue',
      garden: 'green',
      security: 'red',
      swimmingPool: 'cyan',
      wifi: 'purple',
      tv: 'indigo',
      airConditioning: 'sky',
      kitchen: 'orange',
      gym: 'pink',
    };
    return colorMap[key.toLowerCase()] || 'gray';
  };

  const images = property?.media?.map((m) => m.url) || [];
  const mainImage = images[selectedImageIndex] || images[0];

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleEdit = () => {
    if (property) {
      navigate(`/properties/${property.id}/edit`);
    }
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!property || !id) return;

    try {
      setDeleting(true);
      await propertiesService.deleteProperty(id);
      toast.success('Property Deleted', 'The property has been successfully deleted.');
      navigate('/properties', { replace: true });
    } catch (error) {
      console.error('Failed to delete property:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete property';
      setError(errorMessage);
      toast.error('Delete Failed', errorMessage);
      setDeleteModalOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const handlePublish = () => {
    setPublishModalOpen(true);
  };

  const confirmPublish = async () => {
    if (!property || !id) return;

    try {
      setPublishing(true);
      const updatedProperty = await propertiesService.publishProperty(id);
      setProperty(updatedProperty);
      toast.success(
        'Property Published',
        'The property has been published and is now pending review. It will be visible to the public once approved.'
      );
      setPublishModalOpen(false);
    } catch (error) {
      console.error('Failed to publish property:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to publish property';
      toast.error('Publish Failed', errorMessage);
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-sky-50/30">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 via-white to-sky-50/30">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200/50 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h2>
          <p className="text-gray-600 mb-6">{error || 'The property you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/properties')} leftIcon={<ArrowLeft size={18} />}>
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  const features = property.features || {};
  const featureEntries = Object.entries(features);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-sky-50/30">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-4"
        >
          <Button
            variant="outline"
            onClick={() => navigate('/properties')}
            leftIcon={<ArrowLeft size={18} />}
            className="bg-white/80 backdrop-blur-sm"
          >
            Back to Properties
          </Button>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {property.status !== 'ACTIVE' && property.status !== 'PENDING' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePublish}
                disabled={publishing}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                title="Publish Property"
              >
                {publishing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span className="hidden sm:inline">Publishing...</span>
                  </>
                ) : (
                  <>
                    <Globe size={18} />
                    <span className="hidden sm:inline">Publish</span>
                  </>
                )}
              </motion.button>
            )}
            {property.status === 'PENDING' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200/60 text-yellow-700 rounded-xl">
                <Globe size={18} />
                <span className="hidden sm:inline">Pending Review</span>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 border border-emerald-200/60 hover:border-emerald-300 text-emerald-700 hover:text-emerald-800 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
              title="Edit Property"
            >
              <Edit size={18} />
              <span className="hidden sm:inline">Edit</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border border-red-200/60 hover:border-red-300 text-red-700 hover:text-red-800 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
              title="Delete Property"
            >
              <Trash2 size={18} />
              <span className="hidden sm:inline">Delete</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden"
        >
          <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200">
            {mainImage ? (
              <img
                src={mainImage}
                alt={property.title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setIsImageModalOpen(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building2 size={64} className="text-gray-400" />
              </div>
            )}

            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePreviousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-md rounded-full hover:bg-white transition-colors shadow-lg z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} className="text-gray-700" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-md rounded-full hover:bg-white transition-colors shadow-lg z-10"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} className="text-gray-700" />
                </button>
              </>
            )}

            {/* Status Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${getStatusBadgeColor(property.status)} backdrop-blur-sm shadow-lg`}>
                {property.status}
              </span>
            </div>

            {/* Price Badge */}
            {property.price && (
              <div className="absolute bottom-4 left-4 z-10">
                <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-white/50">
                  <span className="font-bold text-3xl text-gray-900">{formatPrice()}</span>
                </div>
              </div>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 z-10">
                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white text-sm font-semibold">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all m-2 ${
                      index === selectedImageIndex
                        ? 'border-sky-500 scale-105 shadow-md'
                        : 'border-gray-200 hover:border-sky-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 sm:p-8"
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{property.title}</h1>
              {property.description && (
                <p className="text-gray-600 leading-relaxed text-lg">{property.description}</p>
              )}
            </motion.div>

            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 sm:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Building2 className="w-6 h-6 text-sky-600" />
                Property Details
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {property.bedrooms !== null && property.bedrooms !== undefined && (
                  <div className="flex flex-col items-center p-4 bg-sky-50 rounded-xl border border-sky-100">
                    <BedDouble size={28} className="text-sky-600 mb-2" />
                    <span className="font-bold text-2xl text-sky-700">{property.bedrooms}</span>
                    <span className="text-sm text-sky-600">Bedroom{property.bedrooms !== 1 ? 's' : ''}</span>
                  </div>
                )}
                {property.bathrooms !== null && property.bathrooms !== undefined && (
                  <div className="flex flex-col items-center p-4 bg-cyan-50 rounded-xl border border-cyan-100">
                    <Bath size={28} className="text-cyan-600 mb-2" />
                    <span className="font-bold text-2xl text-cyan-700">{property.bathrooms}</span>
                    <span className="text-sm text-cyan-600">Bathroom{property.bathrooms !== 1 ? 's' : ''}</span>
                  </div>
                )}
                {property.size && (
                  <div className="flex flex-col items-center p-4 bg-teal-50 rounded-xl border border-teal-100">
                    <Square size={28} className="text-teal-600 mb-2" />
                    <span className="font-bold text-xl text-teal-700">{property.size.toLocaleString()}</span>
                    <span className="text-sm text-teal-600">m²</span>
                  </div>
                )}
                {property.landSize && (
                  <div className="flex flex-col items-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <TreePine size={28} className="text-emerald-600 mb-2" />
                    <span className="font-bold text-xl text-emerald-700">{property.landSize.toLocaleString()}</span>
                    <span className="text-sm text-emerald-600">m² Land</span>
                  </div>
                )}
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {property.propertyType && (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-blue-600 font-semibold mb-1">Property Type</p>
                    <p className="text-gray-900 font-medium capitalize">{property.propertyType}</p>
                  </div>
                )}
                {property.listingType && (
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <p className="text-sm text-purple-600 font-semibold mb-1">Listing Type</p>
                    <p className="text-gray-900 font-medium capitalize">{property.listingType}</p>
                  </div>
                )}
                {property.floor !== null && property.floor !== undefined && (
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <p className="text-sm text-indigo-600 font-semibold mb-1">Floor</p>
                    <p className="text-gray-900 font-medium">
                      {property.floor}
                      {property.totalFloors && ` of ${property.totalFloors}`}
                    </p>
                  </div>
                )}
                {property.yearBuilt && (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-sm text-amber-600 font-semibold mb-1">Year Built</p>
                    <p className="text-gray-900 font-medium">{property.yearBuilt}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Rejection Reason */}
            {property.status === 'REJECTED' && property.rejectionReason && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl shadow-md border-2 border-red-200 p-6 sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-red-900 mb-3 flex items-center gap-2">
                      Rejection Reason
                    </h2>
                    <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {property.rejectionReason}
                      </p>
                    </div>
                    {property.moderatedAt && (
                      <p className="text-sm text-red-700 mt-3 flex items-center gap-2">
                        <Calendar size={16} />
                        Rejected on {formatDate(property.moderatedAt)}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Features */}
            {featureEntries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 sm:p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-sky-600" />
                  Features & Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {featureEntries.map(([key, value]) => {
                    const Icon = getFeatureIcon(key);
                    const color = getFeatureColor(key);
                    const colorClasses = {
                      blue: 'bg-blue-50 border-blue-100 text-blue-700',
                      green: 'bg-green-50 border-green-100 text-green-700',
                      red: 'bg-red-50 border-red-100 text-red-700',
                      cyan: 'bg-cyan-50 border-cyan-100 text-cyan-700',
                      purple: 'bg-purple-50 border-purple-100 text-purple-700',
                      indigo: 'bg-indigo-50 border-indigo-100 text-indigo-700',
                      sky: 'bg-sky-50 border-sky-100 text-sky-700',
                      orange: 'bg-orange-50 border-orange-100 text-orange-700',
                      pink: 'bg-pink-50 border-pink-100 text-pink-700',
                      gray: 'bg-gray-50 border-gray-100 text-gray-700',
                    };
                    return (
                      <div
                        key={key}
                        className={`flex flex-col items-center p-4 rounded-xl border ${colorClasses[color as keyof typeof colorClasses] || colorClasses.gray}`}
                      >
                        <Icon size={24} className="mb-2" />
                        <span className="text-sm font-semibold capitalize text-center">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        {typeof value === 'boolean' && value && (
                          <span className="text-xs mt-1">✓ Available</span>
                        )}
                        {typeof value !== 'boolean' && value !== null && value !== undefined && (
                          <span className="text-xs mt-1">{String(value)}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 sm:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <MapPin className="w-6 h-6 text-sky-600" />
                Location
              </h2>
              <div className="space-y-3">
                {property.address && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <MapPin size={20} className="text-sky-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Address</p>
                      <p className="text-gray-600">{property.address}</p>
                    </div>
                  </div>
                )}
                {(property.district || property.region || property.ward) && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {property.ward && (
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-sm text-blue-600 font-semibold mb-1">Ward</p>
                        <p className="text-gray-900 font-medium">{property.ward}</p>
                      </div>
                    )}
                    {property.district && (
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <p className="text-sm text-purple-600 font-semibold mb-1">District</p>
                    <p className="text-gray-900 font-medium">{property.district}</p>
                  </div>
                )}
                    {property.region && (
                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                        <p className="text-sm text-emerald-600 font-semibold mb-1">Region</p>
                        <p className="text-gray-900 font-medium">{property.region}</p>
                      </div>
                    )}
                  </div>
                )}
                {property.latitude != null && property.longitude != null && (
                  <div className="p-4 bg-sky-50 rounded-xl border border-sky-100">
                    <p className="text-sm text-sky-600 font-semibold mb-2">Coordinates</p>
                    <p className="text-gray-700 font-mono text-sm">
                      {Number(property.latitude).toFixed(6)}, {Number(property.longitude).toFixed(6)}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 sm:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-sky-600" />
                Contact Information
              </h2>
              <div className="space-y-4">
                {property.contactName && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <User size={20} className="text-sky-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold text-gray-900">{property.contactName}</p>
                    </div>
                  </div>
                )}
                {property.contactPhone && (
                  <a
                    href={`tel:${property.contactPhone}`}
                    className="flex items-center gap-3 p-3 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors border border-sky-100"
                  >
                    <Phone size={20} className="text-sky-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold text-sky-700">{property.contactPhone}</p>
                    </div>
                  </a>
                )}
                {property.contactEmail && (
                  <a
                    href={`mailto:${property.contactEmail}`}
                    className="flex items-center gap-3 p-3 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors border border-sky-100"
                  >
                    <Mail size={20} className="text-sky-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-sky-700">{property.contactEmail}</p>
                    </div>
                  </a>
                )}
                {property.ownerType && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Owner Type</p>
                    <p className="font-semibold text-gray-900 capitalize">{property.ownerType}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 sm:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Eye className="w-6 h-6 text-sky-600" />
                Statistics
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3">
                    <Eye size={20} className="text-blue-600" />
                    <span className="text-gray-700 font-medium">Views</span>
                  </div>
                  <span className="font-bold text-blue-700">{property.views || 0}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-pink-50 rounded-xl border border-pink-100">
                  <div className="flex items-center gap-3">
                    <Heart size={20} className="text-pink-600" />
                    <span className="text-gray-700 font-medium">Favorites</span>
                  </div>
                  <span className="font-bold text-pink-700">{property.favorites || 0}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-cyan-50 rounded-xl border border-cyan-100">
                  <div className="flex items-center gap-3">
                    <MessageCircle size={20} className="text-cyan-600" />
                    <span className="text-gray-700 font-medium">Inquiries</span>
                  </div>
                  <span className="font-bold text-cyan-700">{property.inquiries || 0}</span>
                </div>
              </div>
            </motion.div>

            {/* Additional Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 sm:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-sky-600" />
                Additional Info
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium text-gray-900">{formatDate(property.createdAt)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Updated</span>
                  <span className="font-medium text-gray-900">{formatDate(property.updatedAt)}</span>
                </div>
                {property.publishedAt && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Published</span>
                    <span className="font-medium text-gray-900">{formatDate(property.publishedAt)}</span>
                  </div>
                )}
                {property.expiresAt && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Expires</span>
                    <span className="font-medium text-gray-900">{formatDate(property.expiresAt)}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && mainImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-10"
          >
            <X size={24} className="text-white" />
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreviousImage();
                }}
                className="absolute left-4 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-10"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-4 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-10"
              >
                <ChevronRight size={24} className="text-white" />
              </button>
            </>
          )}
          <img
            src={mainImage}
            alt={property.title}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Publish Confirmation Modal */}
      <ConfirmationModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        onConfirm={confirmPublish}
        title="Publish Property"
        message={`Are you sure you want to publish "${property?.title}"? The property will be submitted for review and will be visible to the public once approved by an admin.`}
        confirmText="Publish"
        cancelText="Cancel"
        variant="info"
        loading={publishing}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Property"
        message={`Are you sure you want to delete "${property?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}

