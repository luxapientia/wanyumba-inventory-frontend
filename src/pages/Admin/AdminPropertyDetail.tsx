import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  CheckCircle,
  XCircle,
  DollarSign,
  ImageIcon,
  Info,
  Car,
  Trees,
  Shield,
  Waves,
  Wifi,
  Wind,
  Flame,
  Zap,
  Droplet,
  Sofa,
  Utensils,
  Dumbbell,
  Sparkles,
  Check,
} from 'lucide-react';
import Button from '../../components/UI/Button.js';
import { ConfirmationModal, Map } from '../../components/UI/index.js';
import { useToast } from '../../contexts/index.js';
import propertiesService from '../../api/properties.service.js';
import type { RealEstateProperty, PropertyStatus } from '../../api/types.js';


export default function AdminPropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [property, setProperty] = useState<RealEstateProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'activate' | 'reject'>('activate');
  const [processing, setProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [rejectionReason, setRejectionReason] = useState('');

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

  const handleActivate = () => {
    setActionType('activate');
    setActionModalOpen(true);
  };

  const handleReject = () => {
    setActionType('reject');
    setActionModalOpen(true);
  };

  const confirmAction = async () => {
    if (!property || !id) return;

    // Validate rejection reason if rejecting
    if (actionType === 'reject' && !rejectionReason.trim()) {
      toast.error('Rejection Reason Required', 'Please provide a reason for rejecting this property.');
      return;
    }

    try {
      setProcessing(true);
      if (actionType === 'activate') {
        await propertiesService.activateProperty(id);
        toast.success('Property Activated', 'The property has been activated and is now visible to the public.');
        navigate('/admin/properties/pending');
      } else {
        await propertiesService.rejectProperty(id, rejectionReason.trim());
        toast.error('Property Rejected', 'The property has been rejected.');
        navigate('/admin/properties/pending');
      }
    } catch (error) {
      console.error(`Failed to ${actionType} property:`, error);
      const errorMessage = error instanceof Error ? error.message : `Failed to ${actionType} property`;
      toast.error('Action Failed', errorMessage);
    } finally {
      setProcessing(false);
      setActionModalOpen(false);
      setRejectionReason('');
    }
  };

  const getStatusBadgeColor = (status: PropertyStatus) => {
    const colors = {
      DRAFT: 'bg-gray-100 text-gray-700 border-gray-300',
      PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      ACTIVE: 'bg-green-100 text-green-700 border-green-300',
      REJECTED: 'bg-red-100 text-red-700 border-red-300',
      SOLD: 'bg-blue-100 text-blue-700 border-blue-300',
      RENTED: 'bg-purple-100 text-purple-700 border-purple-300',
    };
    return colors[status] || colors.DRAFT;
  };

  const formatPrice = () => {
    if (!property?.price) return 'Price on request';
    const currency = property.currency || 'TZS';
    return `${currency} ${property.price.toLocaleString()}`;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200/50 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h2>
          <p className="text-gray-600 mb-6">{error || 'The property you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/admin/properties/pending')} leftIcon={<ArrowLeft size={18} />}>
            Back to Pending Properties
          </Button>
        </div>
      </div>
    );
  }

  // Temporary user info (will be replaced with real data later)
  const tempUserInfo = {
    name: property.contactName || 'John Doe',
    email: property.contactEmail || 'john.doe@example.com',
    phone: property.contactPhone || '+255 123 456 789',
    ownerType: property.ownerType || 'Agent',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/20">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Sticky Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border border-gray-200/50 rounded-2xl shadow-lg mb-6 p-4"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/properties/pending')}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md font-medium"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Back</span>
              </motion.button>
              <div className="hidden md:block">
                <h2 className="text-lg font-bold text-gray-900">Property Review</h2>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>

            {/* Action Buttons */}
            {property.status === 'PENDING' && (
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReject}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 hover:from-red-600 hover:via-red-700 hover:to-rose-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl font-semibold group"
                >
                  <XCircle size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                  <span className="hidden sm:inline">Reject</span>
                  <span className="sm:hidden">✕</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleActivate}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 hover:from-green-600 hover:via-emerald-700 hover:to-teal-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl font-semibold group"
                >
                  <CheckCircle size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                  <span className="hidden sm:inline">Activate</span>
                  <span className="sm:hidden">✓</span>
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-4 md:space-y-6">
            {/* Images Gallery */}
            {property.media && property.media.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
              >
                {/* Main Image */}
                <div className="relative h-64 sm:h-80 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200 group">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedImage}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      src={property.media[selectedImage]?.url}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </AnimatePresence>
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-sm font-medium rounded-lg flex items-center gap-2">
                    <ImageIcon size={16} />
                    <span>{selectedImage + 1} / {property.media.length}</span>
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                {property.media.length > 1 && (
                  <div className="p-3 sm:p-4 bg-gray-50">
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                      {property.media.map((media, index) => (
                        <motion.button
                          key={media.id}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedImage(index)}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                            selectedImage === index
                              ? 'border-purple-500 shadow-lg ring-2 ring-purple-200'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <img
                            src={media.url}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-sm border border-gray-200/50 h-64 sm:h-80 md:h-96 flex items-center justify-center"
              >
                <div className="text-center">
                  <ImageIcon size={48} className="text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No images available</p>
                </div>
              </motion.div>
            )}

            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6"
            >
              {/* Title and Status */}
              <div className="mb-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                    {property.title || 'Untitled Property'}
                  </h1>
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 shadow-sm whitespace-nowrap ${getStatusBadgeColor(property.status)}`}>
                    {property.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={24} className="text-purple-600" />
                  <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {formatPrice()}
                  </span>
                  {property.listingType && (
                    <span className="ml-auto px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-semibold capitalize">
                      For {property.listingType}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div className="mb-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Info size={18} className="text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Description</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    {property.description}
                  </p>
                </div>
              )}

              {/* Property Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {property.bedrooms !== null && property.bedrooms !== undefined && (
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="flex items-center gap-3 p-4 bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl border border-sky-200/50 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-11 h-11 bg-sky-100 rounded-lg flex items-center justify-center">
                      <BedDouble size={22} className="text-sky-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Bedrooms</p>
                      <p className="text-lg font-bold text-gray-900">{property.bedrooms}</p>
                    </div>
                  </motion.div>
                )}
                {property.bathrooms !== null && property.bathrooms !== undefined && (
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="flex items-center gap-3 p-4 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl border border-cyan-200/50 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-11 h-11 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <Bath size={22} className="text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Bathrooms</p>
                      <p className="text-lg font-bold text-gray-900">{property.bathrooms}</p>
                    </div>
                  </motion.div>
                )}
                {property.size && (
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="flex items-center gap-3 p-4 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl border border-teal-200/50 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-11 h-11 bg-teal-100 rounded-lg flex items-center justify-center">
                      <Square size={22} className="text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Building Size</p>
                      <p className="text-lg font-bold text-gray-900">{property.size} m²</p>
                    </div>
                  </motion.div>
                )}
                {property.landSize && (
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="flex items-center gap-3 p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200/50 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-11 h-11 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Square size={22} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Land Size</p>
                      <p className="text-lg font-bold text-gray-900">{property.landSize} m²</p>
                    </div>
                  </motion.div>
                )}
                {property.propertyType && (
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200/50 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-11 h-11 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Building2 size={22} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Type</p>
                      <p className="text-sm font-bold text-gray-900 capitalize">{property.propertyType}</p>
                    </div>
                  </motion.div>
                )}
                {property.yearBuilt && (
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="flex items-center gap-3 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200/50 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-11 h-11 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Calendar size={22} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Year Built</p>
                      <p className="text-lg font-bold text-gray-900">{property.yearBuilt}</p>
                    </div>
                  </motion.div>
                )}
                {(property.floor !== null && property.floor !== undefined) && (
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="flex items-center gap-3 p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200/50 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-11 h-11 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Building2 size={22} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Floor</p>
                      <p className="text-lg font-bold text-gray-900">
                        {property.floor}
                        {property.totalFloors && ` / ${property.totalFloors}`}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Location */}
              {property.address && (
                <div className="mb-6">
                  <div className="p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-xl border border-purple-200/50 shadow-sm">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin size={20} className="text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 mb-1">Location</p>
                        <p className="text-sm text-gray-700">
                          {property.address}
                          {property.ward && `, ${property.ward}`}
                          {property.district && `, ${property.district}`}
                          {property.region && `, ${property.region}`}
                        </p>
                      </div>
                    </div>
                    {(property.latitude && property.longitude) && (
                      <div className="pt-3 border-t border-purple-200/50 mt-3">
                        <p className="text-xs text-gray-600 mb-2 font-medium">Location Map:</p>
                        <Map
                          latitude={Number(property.latitude)}
                          longitude={Number(property.longitude)}
                          address={property.address}
                          title={property.title}
                          height="300px"
                        />
                        <p className="text-xs text-gray-500 mt-2 font-mono">
                          Coordinates: {property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Features & Amenities */}
              {property.features && typeof property.features === 'object' && Object.keys(property.features).length > 0 && (() => {
                // Icon mapping for common features
                const featureIcons: Record<string, { icon: typeof Car; color: string; bgColor: string; borderColor: string }> = {
                  parking: { icon: Car, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
                  garden: { icon: Trees, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
                  security: { icon: Shield, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
                  swimmingPool: { icon: Waves, color: 'text-cyan-600', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200' },
                  pool: { icon: Waves, color: 'text-cyan-600', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200' },
                  wifi: { icon: Wifi, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
                  airConditioning: { icon: Wind, color: 'text-sky-600', bgColor: 'bg-sky-50', borderColor: 'border-sky-200' },
                  ac: { icon: Wind, color: 'text-sky-600', bgColor: 'bg-sky-50', borderColor: 'border-sky-200' },
                  heating: { icon: Flame, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
                  electricity: { icon: Zap, color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
                  water: { icon: Droplet, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
                  furnished: { icon: Sofa, color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
                  kitchen: { icon: Utensils, color: 'text-rose-600', bgColor: 'bg-rose-50', borderColor: 'border-rose-200' },
                  gym: { icon: Dumbbell, color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
                  fitness: { icon: Dumbbell, color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
                };

                return (
                  <div className="mb-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-gray-100">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                        <Sparkles size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">Features & Amenities</h3>
                        <p className="text-xs text-gray-500">Property Highlights</p>
                      </div>
                      <div className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border border-purple-200 shadow-sm">
                        <span className="text-sm font-bold text-purple-700">
                          {Object.keys(property.features).length} Features
                        </span>
                      </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(property.features).map(([key, value]) => {
                        // Convert camelCase to Title Case
                        const label = key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())
                          .trim();
                        
                        // Get icon configuration or use default
                        const iconConfig = featureIcons[key] || {
                          icon: Check,
                          color: 'text-purple-600',
                          bgColor: 'bg-purple-50',
                          borderColor: 'border-purple-200'
                        };
                        
                        const FeatureIcon = iconConfig.icon;
                        
                        return (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.03, y: -3 }}
                            transition={{ duration: 0.2 }}
                            className={`group relative flex items-center gap-3 p-3 ${iconConfig.bgColor} rounded-xl border ${iconConfig.borderColor} shadow-sm hover:shadow-md transition-all duration-300`}
                          >
                            {/* Icon Container */}
                            <div className={`w-10 h-10 ${iconConfig.bgColor} rounded-lg flex items-center justify-center border ${iconConfig.borderColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                              <FeatureIcon size={20} className={iconConfig.color} />
                            </div>
                            
                            {/* Label and Value */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 leading-tight">{label}</p>
                              {value !== true && value !== 'true' && value !== false && value !== 'false' && (
                                <p className="text-xs text-gray-600 mt-0.5 truncate font-medium">
                                  {String(value)}
                                </p>
                              )}
                            </div>

                            {/* Check mark for boolean true values */}
                            {(value === true || value === 'true') && (
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                                <Check size={14} className="text-white" strokeWidth={3} />
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Engagement Stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-5 border-t-2 border-gray-100">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50 shadow-sm"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                    <Eye size={20} className="text-blue-600" />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{property.views || 0}</p>
                  <p className="text-xs text-gray-600 font-medium">Views</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center p-3 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-200/50 shadow-sm"
                >
                  <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center mb-2">
                    <Heart size={20} className="text-rose-600" />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{property.favorites || 0}</p>
                  <p className="text-xs text-gray-600 font-medium">Favorites</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200/50 shadow-sm"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                    <MessageCircle size={20} className="text-purple-600" />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{property.inquiries || 0}</p>
                  <p className="text-xs text-gray-600 font-medium">Inquiries</p>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Owner Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-5 sm:p-6"
            >
              <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Owner Information</h3>
                  <p className="text-xs text-gray-500">Property Owner Details</p>
                </div>
              </div>
              <div className="space-y-4">
                <motion.div whileHover={{ x: 3 }} className="transition-transform">
                  <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">Name</p>
                  <p className="font-semibold text-gray-900 text-base">{tempUserInfo.name}</p>
                </motion.div>
                <motion.div whileHover={{ x: 3 }} className="transition-transform">
                  <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">Owner Type</p>
                  <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg text-sm font-bold capitalize border border-purple-200/50 shadow-sm">
                    {tempUserInfo.ownerType}
                  </span>
                </motion.div>
                <motion.div whileHover={{ x: 3 }} className="transition-transform">
                  <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">Email</p>
                  <a
                    href={`mailto:${tempUserInfo.email}`}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold group"
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <Mail size={16} />
                    </div>
                    <span className="text-sm break-all">{tempUserInfo.email}</span>
                  </a>
                </motion.div>
                <motion.div whileHover={{ x: 3 }} className="transition-transform">
                  <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">Phone</p>
                  <a
                    href={`tel:${tempUserInfo.phone}`}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold group"
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <Phone size={16} />
                    </div>
                    <span className="text-sm">{tempUserInfo.phone}</span>
                  </a>
                </motion.div>
              </div>
            </motion.div>

            {/* Dates Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-5 sm:p-6"
            >
              <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Timeline Details</h3>
                  <p className="text-xs text-gray-500">Important Dates</p>
                </div>
              </div>
              <div className="space-y-3">
                <motion.div
                  whileHover={{ x: 3 }}
                  className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200/50"
                >
                  <p className="text-xs text-gray-600 mb-1 font-medium">Submitted On</p>
                  <p className="font-bold text-gray-900">{formatDate(property.createdAt)}</p>
                </motion.div>
                <motion.div
                  whileHover={{ x: 3 }}
                  className="p-3 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200/50"
                >
                  <p className="text-xs text-gray-600 mb-1 font-medium">Last Updated</p>
                  <p className="font-bold text-gray-900">{formatDate(property.updatedAt)}</p>
                </motion.div>
                {property.publishedAt && (
                  <motion.div
                    whileHover={{ x: 3 }}
                    className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50"
                  >
                    <p className="text-xs text-gray-600 mb-1 font-medium">Published On</p>
                    <p className="font-bold text-gray-900">{formatDate(property.publishedAt)}</p>
                  </motion.div>
                )}
                {property.expiresAt && (
                  <motion.div
                    whileHover={{ x: 3 }}
                    className="p-3 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-200/50"
                  >
                    <p className="text-xs text-gray-600 mb-1 font-medium">Expires On</p>
                    <p className="font-bold text-gray-900">{formatDate(property.expiresAt)}</p>
                  </motion.div>
                )}
                {property.moderatedAt && (
                  <motion.div
                    whileHover={{ x: 3 }}
                    className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200/50"
                  >
                    <p className="text-xs text-gray-600 mb-1 font-medium">Moderated On</p>
                    <p className="font-bold text-gray-900">{formatDate(property.moderatedAt)}</p>
                    {property.moderatedBy && (
                      <p className="text-xs text-gray-600 mt-1">By: {property.moderatedBy}</p>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Rejection Reason (if rejected) */}
            {property.status === 'REJECTED' && property.rejectionReason && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-red-200/50 p-5 sm:p-6"
              >
                <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-red-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                    <XCircle size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Rejection Reason</h3>
                    <p className="text-xs text-gray-500">Admin Feedback</p>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-200/50">
                  <p className="text-sm text-gray-700 leading-relaxed">{property.rejectionReason}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={actionModalOpen}
        onClose={() => {
          setActionModalOpen(false);
          setRejectionReason('');
        }}
        onConfirm={confirmAction}
        title={actionType === 'activate' ? 'Activate Property' : 'Reject Property'}
        message={
          actionType === 'activate'
            ? `Are you sure you want to activate "${property.title}"? This will make it visible to the public.`
            : `Are you sure you want to reject "${property.title}"? The owner will be notified.`
        }
        confirmText={actionType === 'activate' ? 'Activate' : 'Reject'}
        cancelText="Cancel"
        variant={actionType === 'activate' ? 'info' : 'danger'}
        loading={processing}
      >
        {actionType === 'reject' && (
          <div className="mt-4">
            <label htmlFor="rejectionReason" className="block text-sm font-semibold text-gray-900 mb-2">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a detailed reason for rejecting this property..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-gray-900 placeholder-gray-400 resize-none"
              rows={4}
              required
            />
            <p className="mt-2 text-xs text-gray-500">
              This reason will be visible to the property owner.
            </p>
          </div>
        )}
      </ConfirmationModal>
    </div>
  );
}

