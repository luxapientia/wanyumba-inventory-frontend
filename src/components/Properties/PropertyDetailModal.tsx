import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Building2, BedDouble, Bath, Square, Phone, Mail, Globe, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';
import type { FC } from 'react';
import type { ScrapedProperty } from '../../api/types.js';

export interface PropertyDetailModalProps {
  listing: ScrapedProperty | null;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyDetailModal: FC<PropertyDetailModalProps> = ({ listing, isOpen, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!listing) return null;

  const formatPrice = () => {
    if (!listing.price) return 'Price on request';
    const currency = listing.priceCurrency || 'TSh';
    return `${currency} ${listing.price.toLocaleString()}`;
  };

  const getSourceBadgeColor = () => {
    if (listing.source === 'jiji') {
      return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white';
    }
    if (listing.source === 'kupatana') {
      return 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white';
    }
    return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col"
            >
              {/* Header */}
              <div className="relative h-80 sm:h-96 md:h-[500px] bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 overflow-hidden">
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title || 'Property image'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 size={64} className="text-gray-400" />
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full hover:bg-white transition-colors shadow-lg z-10"
                >
                  <X size={20} className="text-gray-700" />
                </button>

                {/* Source badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${getSourceBadgeColor()} backdrop-blur-sm shadow-lg`}>
                    {listing.source?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>

                {/* Price badge */}
                {listing.price && (
                  <div className="absolute bottom-4 left-4 z-10">
                    <div className="bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-white/50">
                      <span className="font-bold text-2xl text-gray-900">
                        {formatPrice()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                {/* Images Gallery - Moved to top */}
                {listing.images && listing.images.length > 1 && (
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Property Images</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {listing.images.slice(1, 11).map((image, index) => (
                        <div key={index} className="aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer hover:scale-105 transition-transform duration-300 border-2 border-transparent hover:border-sky-300">
                          <img
                            src={image}
                            alt={`Property image ${index + 2}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Title */}
                <div>
                  <h2 className="font-bold text-2xl sm:text-3xl text-gray-900 mb-2">
                    {listing.title || 'Untitled Property'}
                  </h2>
                  {listing.description && (
                    <p className="text-gray-600 leading-relaxed">
                      {listing.description}
                    </p>
                  )}
                </div>

                {/* Property Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {listing.bedrooms !== null && listing.bedrooms !== undefined && (
                    <div className="flex flex-col items-center p-4 bg-sky-50 rounded-xl border border-sky-100">
                      <BedDouble size={24} className="text-sky-600 mb-2" />
                      <span className="font-bold text-xl text-sky-700">{listing.bedrooms}</span>
                      <span className="text-sm text-sky-600">Bedroom{listing.bedrooms !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {listing.bathrooms !== null && listing.bathrooms !== undefined && (
                    <div className="flex flex-col items-center p-4 bg-cyan-50 rounded-xl border border-cyan-100">
                      <Bath size={24} className="text-cyan-600 mb-2" />
                      <span className="font-bold text-xl text-cyan-700">{listing.bathrooms}</span>
                      <span className="text-sm text-cyan-600">Bathroom{listing.bathrooms !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {listing.livingAreaSqm && (
                    <div className="flex flex-col items-center p-4 bg-teal-50 rounded-xl border border-teal-100">
                      <Square size={24} className="text-teal-600 mb-2" />
                      <span className="font-bold text-xl text-teal-700">
                        {listing.livingAreaSqm.toLocaleString()}
                      </span>
                      <span className="text-sm text-teal-600">m²</span>
                    </div>
                  )}
                  {listing.propertyType && (
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <Building2 size={24} className="text-gray-600 mb-2" />
                      <span className="font-bold text-lg text-gray-700 capitalize text-center">
                        {listing.propertyType}
                      </span>
                    </div>
                  )}
                </div>

                {/* Location */}
                {listing.addressText && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <MapPin size={20} className="text-sky-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Location</p>
                      <p className="text-gray-600">{listing.addressText}</p>
                      {listing.city && (
                        <p className="text-sm text-gray-500 mt-1">
                          {listing.city}
                          {listing.region && `, ${listing.region}`}
                          {listing.district && `, ${listing.district}`}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {listing.listingType && (
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-sm text-blue-600 font-semibold mb-1">Listing Type</p>
                      <p className="text-gray-900 font-medium capitalize">{listing.listingType}</p>
                    </div>
                  )}
                  {listing.pricePeriod && (
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                      <p className="text-sm text-purple-600 font-semibold mb-1">Price Period</p>
                      <p className="text-gray-900 font-medium capitalize">{listing.pricePeriod}</p>
                    </div>
                  )}
                  {listing.landAreaSqm && (
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <p className="text-sm text-emerald-600 font-semibold mb-1">Land Area</p>
                      <p className="text-gray-900 font-medium">{listing.landAreaSqm.toLocaleString()} m²</p>
                    </div>
                  )}
                </div>

                {/* Agent Information */}
                {(listing.agentName || listing.agentPhone || listing.agentEmail) && (
                  <div className="p-5 bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl border border-sky-100">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      {listing.agentName && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg">
                            <Building2 size={18} className="text-sky-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Agent Name</p>
                            <p className="font-semibold text-gray-900">{listing.agentName}</p>
                          </div>
                        </div>
                      )}
                      {listing.agentPhone && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg">
                            <Phone size={18} className="text-sky-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <a href={`tel:${listing.agentPhone}`} className="font-semibold text-sky-600 hover:text-sky-700">
                              {listing.agentPhone}
                            </a>
                          </div>
                        </div>
                      )}
                      {listing.agentEmail && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg">
                            <Mail size={18} className="text-sky-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <a href={`mailto:${listing.agentEmail}`} className="font-semibold text-sky-600 hover:text-sky-700">
                              {listing.agentEmail}
                            </a>
                          </div>
                        </div>
                      )}
                      {listing.agentWebsite && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg">
                            <Globe size={18} className="text-sky-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Website</p>
                            <a
                              href={listing.agentWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                            >
                              Visit Website
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  {listing.rawUrl && (
                    <a
                      href={listing.rawUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-sky-500/50 transition-all duration-300"
                    >
                      <span>View on Source Website</span>
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PropertyDetailModal;

