import { motion } from 'framer-motion';
import type { FC } from 'react';
import { MapPin, Building2, BookmarkPlus, Eye, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ScrapedProperty } from '../../api/types.js';

export interface DiscoveredPropertyCardProps {
  listing: ScrapedProperty;
  index: number;
  viewMode?: 'grid' | 'list';
  onAddToProperties?: (listing: ScrapedProperty) => void;
  onViewDetails?: (listing: ScrapedProperty) => void;
}

const DiscoveredPropertyCard: FC<DiscoveredPropertyCardProps> = ({
  listing,
  index,
  viewMode = 'grid',
  onAddToProperties,
  onViewDetails,
}) => {
  const navigate = useNavigate();

  const formatPrice = () => {
    if (!listing.price) return 'Price on request';
    const currency = listing.priceCurrency || 'TSh';
    return `${currency} ${listing.price.toLocaleString()}`;
  };

  const getSourceBadgeColor = () => {
    if (listing.source === 'jiji') {
      return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30';
    }
    if (listing.source === 'kupatana') {
      return 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/30';
    }
    return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg';
  };

  const handleAddToProperties = () => {
    // Navigate to AddProperty page with the scraped property data
    navigate('/properties/new', {
      state: {
        scrapedProperty: listing,
      },
    });
  };

  const isListView = viewMode === 'list';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative bg-white rounded-3xl shadow-md border border-gray-200/60 hover:shadow-2xl hover:shadow-sky-500/10 hover:border-sky-300/60 transition-all duration-500 overflow-hidden backdrop-blur-sm flex flex-col ${
        isListView ? 'flex-row' : 'w-full'
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
        {listing.images && listing.images.length > 0 ? (
          <img
            src={listing.images[0]}
            alt={listing.title || 'Property image'}
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
        
        {/* Source Badge */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 + 0.1 }}
            className={`inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold ${getSourceBadgeColor()} backdrop-blur-sm`}
          >
            {listing.source?.toUpperCase() || 'UNKNOWN'}
          </motion.span>
        </div>

        {/* Price Badge */}
        {listing.price && (
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
        {/* Top Section - Title, Description, Property Details */}
        <div className="flex-1 space-y-3 sm:space-y-4 min-h-0">
          {/* Title */}
          <div>
            <h3 className="font-bold text-lg sm:text-xl text-gray-900 line-clamp-2 group-hover:text-sky-600 transition-colors duration-300 leading-tight">
              {listing.title || 'Untitled Property'}
            </h3>
            {listing.description && (
              <p className="text-sm text-gray-600 mt-2 sm:mt-2.5 line-clamp-2 leading-relaxed">
                {listing.description}
              </p>
            )}
          </div>

          {/* Property Details */}
          <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
            {listing.bedrooms !== null && listing.bedrooms !== undefined && (
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-sky-50 rounded-lg sm:rounded-xl border border-sky-100">
                <span className="font-bold text-sky-700">{listing.bedrooms}</span>
                <span className="text-sky-600">Bed{listing.bedrooms !== 1 ? 's' : ''}</span>
              </div>
            )}
            {listing.bathrooms !== null && listing.bathrooms !== undefined && (
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-cyan-50 rounded-lg sm:rounded-xl border border-cyan-100">
                <span className="font-bold text-cyan-700">{listing.bathrooms}</span>
                <span className="text-cyan-600">Bath{listing.bathrooms !== 1 ? 's' : ''}</span>
              </div>
            )}
            {listing.livingAreaSqm && (
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-teal-50 rounded-lg sm:rounded-xl border border-teal-100">
                <span className="font-bold text-teal-700">
                  {listing.livingAreaSqm.toLocaleString()}
                </span>
                <span className="text-teal-600">m²</span>
              </div>
            )}
            {listing.propertyType && (
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100">
                <span className="text-gray-700 capitalize font-medium">{listing.propertyType}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section - Location and Action Buttons (Always at bottom) */}
        <div className="mt-auto pt-3 sm:pt-4 space-y-3 sm:space-y-4 border-t border-gray-100">
          {/* Location */}
          {listing.addressText && (
            <div className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm text-gray-600 bg-gray-50/50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 border border-gray-100">
              <MapPin size={16} className="sm:w-[18px] sm:h-[18px] text-sky-500 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2 leading-relaxed">{listing.addressText}</span>
            </div>
          )}

          {/* Footer - Action Buttons */}
          <div className="flex items-center justify-end gap-2 sm:gap-3">
          {/* Detail Button */}
          {onViewDetails && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(listing);
              }}
              className="inline-flex items-center justify-center p-2.5 sm:p-3 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border border-blue-200/60 hover:border-blue-300 text-blue-700 hover:text-blue-800 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
              title="View Details"
            >
              <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
            </motion.button>
          )}
          {onAddToProperties && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                handleAddToProperties();
              }}
              className="inline-flex items-center justify-center p-2.5 sm:p-3 bg-white border-2 border-sky-200 text-sky-600 hover:bg-sky-50 hover:border-sky-300 rounded-full transition-all duration-300 shadow-lg cursor-pointer"
              title="Add to My Properties"
            >
              <BookmarkPlus size={16} className="sm:w-[18px] sm:h-[18px]" />
            </motion.button>
          )}
          {listing.rawUrl && (
            <motion.a
              href={listing.rawUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center p-2.5 sm:p-3 bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 text-white rounded-full hover:shadow-xl hover:shadow-sky-500/50 transition-all duration-300 group/link"
              onClick={(e) => e.stopPropagation()}
              title="View on source website"
            >
              <Globe size={16} className="sm:w-[18px] sm:h-[18px] group-hover/link:rotate-12 transition-transform duration-300" />
            </motion.a>
          )}
        </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DiscoveredPropertyCard;

