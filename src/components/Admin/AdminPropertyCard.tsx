import { motion } from 'framer-motion';
import {
  MapPin,
  Building2,
  BedDouble,
  Bath,
  Square,
  DollarSign,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import type { RealEstateProperty, PropertyStatus } from '../../api/types.js';

interface AdminPropertyCardProps {
  property: RealEstateProperty;
  index?: number;
  onClick?: (property: RealEstateProperty) => void;
  showStatusBadge?: boolean;
  customBadge?: {
    label: string;
    icon: React.ReactNode;
    color: string; // e.g., 'yellow', 'red', 'green'
  };
  borderColor?: string; // e.g., 'yellow-200/60', 'red-200/60'
  hoverBorderColor?: string; // e.g., 'yellow-300/80', 'red-300/80'
}

const statusConfig: Record<
  PropertyStatus,
  { label: string; icon: React.ReactNode; bgColor: string; textColor: string }
> = {
  DRAFT: {
    label: 'Draft',
    icon: <Building2 size={12} />,
    bgColor: 'bg-gray-500',
    textColor: 'text-white',
  },
  PENDING: {
    label: 'Pending Review',
    icon: <Clock size={12} />,
    bgColor: 'bg-yellow-500',
    textColor: 'text-white',
  },
  ACTIVE: {
    label: 'Active',
    icon: <CheckCircle size={12} />,
    bgColor: 'bg-green-500',
    textColor: 'text-white',
  },
  REJECTED: {
    label: 'Rejected',
    icon: <XCircle size={12} />,
    bgColor: 'bg-red-500',
    textColor: 'text-white',
  },
  SOLD: {
    label: 'Sold',
    icon: <CheckCircle size={12} />,
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
  },
  RENTED: {
    label: 'Rented',
    icon: <CheckCircle size={12} />,
    bgColor: 'bg-indigo-500',
    textColor: 'text-white',
  },
};

export default function AdminPropertyCard({
  property,
  index = 0,
  onClick,
  showStatusBadge = true,
  customBadge,
  borderColor = 'gray-200/50',
  hoverBorderColor = 'gray-300/80',
}: AdminPropertyCardProps) {
  const formatPrice = (price?: number | string, currency?: string) => {
    if (!price) return 'Price on request';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return 'Price on request';
    return `${currency || 'TZS'} ${numPrice.toLocaleString()}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(property);
    }
  };

  const statusBadge = showStatusBadge && property.status ? statusConfig[property.status] : null;
  const badge = customBadge || statusBadge;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={handleClick}
      className={`group bg-white rounded-2xl shadow-md border border-${borderColor} overflow-hidden hover:shadow-2xl hover:border-${hoverBorderColor} transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex flex-col xl:flex-row min-h-[12rem] xl:min-h-0">
        {/* Image Section */}
        <div className="relative xl:w-72 h-48 xl:h-auto xl:min-h-full flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {property.media && property.media.length > 0 ? (
            <>
              <img
                src={property.media[0].url}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {/* Image Count Badge */}
              {property.media.length > 1 && (
                <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold rounded-lg flex items-center gap-1">
                  <Building2 size={12} />
                  <span>{property.media.length} Photos</span>
                </div>
              )}
              {/* Status Badge */}
              {badge && (
                <div
                  className={`absolute top-3 left-3 px-3 py-1.5 ${
                    customBadge ? `bg-${customBadge.color}-500` : (statusBadge?.bgColor || '')
                  } ${customBadge ? 'text-white' : (statusBadge?.textColor || '')} text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5`}
                >
                  {badge.icon}
                  <span>{badge.label}</span>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Building2 size={40} className="text-gray-300 mb-2" />
              <span className="text-gray-400 text-sm font-medium">No Image</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 sm:p-5">
          {/* Header */}
          <div className="mb-3">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {property.title || 'Untitled Property'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-1 leading-relaxed">
              {property.description || 'No description available'}
            </p>
          </div>

          {/* Price & Type */}
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                <DollarSign size={14} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 leading-tight">Price</p>
                <p className="text-sm font-bold text-gray-900">
                  {formatPrice(property.price, property.currency)}
                </p>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <Building2 size={14} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 leading-tight">Type</p>
                <p className="text-sm font-bold text-gray-900 capitalize">
                  {property.propertyType || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Property Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            {(property.bedrooms !== null && property.bedrooms !== undefined) && (
              <div className="flex items-center gap-1.5 p-2 bg-sky-50 rounded-lg border border-sky-200/50">
                <BedDouble size={16} className="text-sky-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600 leading-tight">Beds</p>
                  <p className="text-sm font-bold text-gray-900">{property.bedrooms}</p>
                </div>
              </div>
            )}
            {(property.bathrooms !== null && property.bathrooms !== undefined) && (
              <div className="flex items-center gap-1.5 p-2 bg-cyan-50 rounded-lg border border-cyan-200/50">
                <Bath size={16} className="text-cyan-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600 leading-tight">Baths</p>
                  <p className="text-sm font-bold text-gray-900">{property.bathrooms}</p>
                </div>
              </div>
            )}
            {property.size && (
              <div className="flex items-center gap-1.5 p-2 bg-teal-50 rounded-lg border border-teal-200/50">
                <Square size={16} className="text-teal-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600 leading-tight">Size</p>
                  <p className="text-sm font-bold text-gray-900">{property.size} m²</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-1.5 p-2 bg-amber-50 rounded-lg border border-amber-200/50">
              <Calendar size={16} className="text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-600 leading-tight">Submitted</p>
                <p className="text-xs font-bold text-gray-900">{formatDate(property.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Location & Owner */}
          <div className="flex flex-col sm:flex-row gap-2">
            {property.address && (
              <div className="flex items-start gap-2 flex-1">
                <MapPin size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Location</p>
                  <p className="text-sm text-gray-900 font-medium line-clamp-1">
                    {property.address}
                    {property.district && `, ${property.district}`}
                  </p>
                </div>
              </div>
            )}
            {property.contactName && (
              <div className="flex items-start gap-2">
                <User size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Owner</p>
                  <p className="text-sm text-gray-900 font-medium">{property.contactName}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

