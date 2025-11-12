import { motion } from 'framer-motion';
import type { FC } from 'react';
import { MapPin, Building2, Eye, Heart, MessageCircle, Pencil, Trash2, EyeIcon } from 'lucide-react';
import type { RealEstateProperty, PropertyStatus } from '../../api/types.js';

export interface PropertyCardProps {
  property: RealEstateProperty;
  index: number;
  viewMode?: 'grid' | 'list';
  onEdit?: (property: RealEstateProperty) => void;
  onDelete?: (property: RealEstateProperty) => void;
  onViewDetails?: (property: RealEstateProperty) => void;
}

const PropertyCard: FC<PropertyCardProps> = ({
  property,
  index,
  viewMode = 'grid',
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const formatPrice = () => {
    if (!property.price) return 'Price on request';
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

  const getMainImage = () => {
    if (property.media && property.media.length > 0) {
      // Get the first image (main image)
      return property.media[0].url;
    }
    return null;
  };

  const isListView = viewMode === 'list';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative bg-white rounded-3xl shadow-md border border-gray-200/60 hover:shadow-2xl hover:shadow-sky-500/10 hover:border-sky-300/60 transition-all duration-500 overflow-hidden backdrop-blur-sm flex flex-col ${
        isListView ? '' : 'w-full'
      }`}
      whileHover={{ y: -4 }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/0 via-cyan-50/0 to-teal-50/0 group-hover:from-sky-50/30 group-hover:via-cyan-50/20 group-hover:to-teal-50/30 transition-all duration-500 pointer-events-none z-0" />

      {/* Image Section */}
      <div
        className={`relative bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 overflow-hidden ${
          isListView ? 'w-72 h-56 flex-shrink-0' : 'h-48 sm:h-52 md:h-56'
        }`}
      >
        {getMainImage() ? (
          <img
            src={getMainImage()!}
            alt={property.title || 'Property image'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-gray-300">
            <Building2 size={56} className="text-gray-400" />
          </div>
        )}

        {/* Gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Status Badge */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 + 0.1 }}
            className={`inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold ${getStatusBadgeColor(property.status)} backdrop-blur-sm`}
          >
            {property.status}
          </motion.span>
        </div>

        {/* Price Badge */}
        {property.price && (
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 + 0.15 }}
              className="bg-white/95 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-xl border border-white/50"
            >
              <span className="font-bold text-base sm:text-lg md:text-xl text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {formatPrice()}
              </span>
            </motion.div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={`relative p-4 sm:p-5 md:p-6 flex flex-col flex-1 z-10 ${isListView ? '' : 'min-h-0'}`}>
        {/* Top Section - Title, Description, Details, Stats */}
        <div className="flex-1 space-y-2 sm:space-y-3 min-h-0">
          {/* Title */}
          <div>
            <h3 className="font-bold text-lg sm:text-xl text-gray-900 line-clamp-2 group-hover:text-sky-600 transition-colors duration-300 leading-tight">
              {property.title || 'Untitled Property'}
            </h3>
            {property.description && (
              <p className="text-sm text-gray-600 mt-2 sm:mt-2.5 line-clamp-2 leading-relaxed">
                {property.description}
              </p>
            )}
          </div>

          {/* Property Details */}
          <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
            {property.bedrooms !== null && property.bedrooms !== undefined && (
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-sky-50 rounded-lg sm:rounded-xl border border-sky-100">
                <span className="font-bold text-sky-700">{property.bedrooms}</span>
                <span className="text-sky-600">Bed{property.bedrooms !== 1 ? 's' : ''}</span>
              </div>
            )}
            {property.bathrooms !== null && property.bathrooms !== undefined && (
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-cyan-50 rounded-lg sm:rounded-xl border border-cyan-100">
                <span className="font-bold text-cyan-700">{property.bathrooms}</span>
                <span className="text-cyan-600">Bath{property.bathrooms !== 1 ? 's' : ''}</span>
              </div>
            )}
            {property.size && (
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-teal-50 rounded-lg sm:rounded-xl border border-teal-100">
                <span className="font-bold text-teal-700">
                  {property.size.toLocaleString()}
                </span>
                <span className="text-teal-600">m²</span>
              </div>
            )}
            {property.propertyType && (
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100">
                <span className="text-gray-700 capitalize font-medium">{property.propertyType}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-500">
            {property.views > 0 && (
              <div className="flex items-center gap-1">
                <Eye size={14} />
                <span>{property.views}</span>
              </div>
            )}
            {property.favorites > 0 && (
              <div className="flex items-center gap-1">
                <Heart size={14} />
                <span>{property.favorites}</span>
              </div>
            )}
            {property.inquiries > 0 && (
              <div className="flex items-center gap-1">
                <MessageCircle size={14} />
                <span>{property.inquiries}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section - Location and Action Buttons (Always at bottom) */}
        <div className="mt-auto pt-1.5 sm:pt-2 space-y-2 sm:space-y-3 border-t border-gray-100">
          {/* Location */}
          {property.address && (
            <div className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm text-gray-600 bg-gray-50/50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 border border-gray-100">
              <MapPin size={16} className="sm:w-[18px] sm:h-[18px] text-sky-500 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2 leading-relaxed">
                {property.address}
                {property.district && `, ${property.district}`}
                {property.region && `, ${property.region}`}
              </span>
            </div>
          )}

          {/* Footer - Action Buttons */}
          <div className="flex items-center justify-end gap-2 sm:gap-2.5">
          {/* View Details Button */}
          {onViewDetails && (
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(property);
              }}
              className="group flex items-center justify-center p-2.5 sm:p-3 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border border-blue-200/60 hover:border-blue-300 text-blue-700 hover:text-blue-800 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
              title="View Details"
            >
              <EyeIcon size={18} className="sm:w-5 sm:h-5" />
            </motion.button>
          )}
          {/* Edit Button */}
          {onEdit && (
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(property);
              }}
              className="group flex items-center justify-center p-2.5 sm:p-3 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 border border-emerald-200/60 hover:border-emerald-300 text-emerald-700 hover:text-emerald-800 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
              title="Edit Property"
            >
              <Pencil size={18} className="sm:w-5 sm:h-5" />
            </motion.button>
          )}
          {/* Delete Button */}
          {onDelete && (
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(property);
              }}
              className="group flex items-center justify-center p-2.5 sm:p-3 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border border-red-200/60 hover:border-red-300 text-red-700 hover:text-red-800 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
              title="Delete Property"
            >
              <Trash2 size={18} className="sm:w-5 sm:h-5" />
            </motion.button>
          )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;

