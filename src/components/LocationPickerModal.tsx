import { useState, useRef, useEffect } from 'react';
import { Locate, MapPin, Navigation, Loader2 } from 'lucide-react';
import Modal from './UI/Modal.js';
import Button from './UI/Button.js';
import { geocodingService } from '../api/index.js';
import type { GeocodingResult } from '../api/geocoding.service.js';

// Type definitions for Leaflet (will be available after npm install)
type LeafletMap = any;
type LeafletMarker = any;
type LeafletTileLayer = any;
type LeafletDragEndEvent = any;

export interface LocationInfo {
  lat: number;
  lng: number;
  address?: string;
  formatted_address?: string;
  district?: string;
  region?: string;
  ward?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  street?: string;
}

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLocation: { lat: number; lng: number };
  onConfirm: (location: LocationInfo) => void;
}

// Default location (Dar es Salaam, Tanzania)
const DEFAULT_LOCATION = { lat: -6.7924, lng: 39.2083 };

const LocationPickerModal = ({
  isOpen,
  onClose,
  initialLocation,
  onConfirm,
}: LocationPickerModalProps) => {
  const [tempLocation, setTempLocation] = useState(() => {
    const location = initialLocation || DEFAULT_LOCATION;
    return {
      lat: typeof location.lat === 'number' && !isNaN(location.lat) ? location.lat : DEFAULT_LOCATION.lat,
      lng: typeof location.lng === 'number' && !isNaN(location.lng) ? location.lng : DEFAULT_LOCATION.lng,
    };
  });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapLayer, setMapLayer] = useState<'street' | 'satellite'>('street');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const tileLayerRef = useRef<LeafletTileLayer | null>(null);

  // Update tempLocation when initialLocation changes
  useEffect(() => {
    if (isOpen) {
      const location = initialLocation || DEFAULT_LOCATION;
      // Ensure lat and lng are valid numbers
      setTempLocation({
        lat: typeof location.lat === 'number' && !isNaN(location.lat) ? location.lat : DEFAULT_LOCATION.lat,
        lng: typeof location.lng === 'number' && !isNaN(location.lng) ? location.lng : DEFAULT_LOCATION.lng,
      });
    }
  }, [initialLocation, isOpen]);

  // Initialize map when modal opens
  useEffect(() => {
    if (isOpen && mapRef.current && !mapLoaded) {
      const loadMap = async () => {
        try {
          // Dynamically import leaflet
          // @ts-expect-error - leaflet types will be available after npm install
          const L = await import('leaflet');
          await import('leaflet/dist/leaflet.css');

          // Fix for default marker icon issue in Leaflet
          delete (L.Icon.Default.prototype as any)._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          });

          if (mapRef.current && !mapRef.current.hasChildNodes()) {
            // Create map with default zoom controls
            const map = L.map(mapRef.current, {
              zoomControl: true,
              scrollWheelZoom: true,
              doubleClickZoom: true,
              touchZoom: true,
            }).setView(
              [tempLocation.lat, tempLocation.lng],
              13
            );

            // Add tile layer
            const tileLayer = L.tileLayer(
              mapLayer === 'street'
                ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
              {
                attribution:
                  mapLayer === 'street'
                    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    : '&copy; <a href="https://www.esri.com/">Esri</a>',
                maxZoom: 19,
              }
            ).addTo(map);

            // Create marker
            const marker = L.marker([tempLocation.lat, tempLocation.lng], {
              draggable: true,
              icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
              }),
            }).addTo(map);

            // Handle marker drag
            marker.on('dragend', (e: LeafletDragEndEvent) => {
              const position = e.target.getLatLng();
              const lat = Number(position.lat);
              const lng = Number(position.lng);
              if (!isNaN(lat) && !isNaN(lng)) {
                setTempLocation({ lat, lng });
              }
            });

            // Store references
            mapInstanceRef.current = map;
            markerRef.current = marker;
            tileLayerRef.current = tileLayer;

            setMapLoaded(true);
          }
        } catch (error) {
          console.error('Error loading map:', error);
        }
      };

      loadMap();
    }

    // Cleanup on unmount or when modal closes
    return () => {
      if (!isOpen && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
        tileLayerRef.current = null;
        setMapLoaded(false);
      }
    };
  }, [isOpen, mapLoaded, tempLocation, mapLayer]);

  // Update map center when tempLocation changes
  useEffect(() => {
    if (mapLoaded && mapInstanceRef.current && markerRef.current) {
      const map = mapInstanceRef.current;
      const marker = markerRef.current;
      
      map.setView([tempLocation.lat, tempLocation.lng], map.getZoom(), {
        animate: true,
      });
      marker.setLatLng([tempLocation.lat, tempLocation.lng]);
    }
  }, [tempLocation, mapLoaded]);

  // Update tile layer when mapLayer changes
  useEffect(() => {
    if (mapLoaded && mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      const oldTileLayer = tileLayerRef.current;
      
      if (oldTileLayer) {
        map.removeLayer(oldTileLayer);
      }

      // Dynamically import leaflet for tile layer
      // @ts-expect-error - leaflet types will be available after npm install
      import('leaflet').then((L) => {
        const newTileLayer = L.default.tileLayer(
          mapLayer === 'street'
            ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          {
            attribution:
              mapLayer === 'street'
                ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                : '&copy; <a href="https://www.esri.com/">Esri</a>',
            maxZoom: 19,
          }
        ).addTo(map);

        tileLayerRef.current = newTileLayer;
      });
    }
  }, [mapLayer, mapLoaded]);

  const handleConfirm = async () => {
    setIsFetchingLocation(true);
    setLocationError(null);

    try {
      // Call reverse geocoding service to get address information
      const geocodingResult = await geocodingService.reverseGeocoding({
        latitude: tempLocation.lat,
        longitude: tempLocation.lng,
        radius: 1000,
      });

      // Extract the best result (first result, usually the most relevant)
      const bestResult: GeocodingResult | undefined = geocodingResult.results[0];

      // Build location info object
      const locationInfo: LocationInfo = {
        lat: tempLocation.lat,
        lng: tempLocation.lng,
        formatted_address: bestResult?.formatted_address,
        address: bestResult?.formatted_address || bestResult?.street || undefined,
        district: bestResult?.district || undefined,
        region: bestResult?.region || undefined,
        ward: undefined, // Ward is not typically in geocoding results
        city: bestResult?.city || undefined,
        country: bestResult?.country || undefined,
        postal_code: bestResult?.postal_code || undefined,
        street: bestResult?.street || undefined,
      };

      // Call the onConfirm callback with location info
      onConfirm(locationInfo);
      onClose();
    } catch (error) {
      console.error('Error fetching location info:', error);
      setLocationError(
        error instanceof Error
          ? error.message
          : 'Failed to fetch location information. Using coordinates only.'
      );

      // Even if geocoding fails, still return the coordinates
      const locationInfo: LocationInfo = {
        lat: tempLocation.lat,
        lng: tempLocation.lng,
      };
      onConfirm(locationInfo);
      onClose();
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const handleCancel = () => {
    const location = initialLocation || DEFAULT_LOCATION;
    setTempLocation({
      lat: typeof location.lat === 'number' && !isNaN(location.lat) ? location.lat : DEFAULT_LOCATION.lat,
      lng: typeof location.lng === 'number' && !isNaN(location.lng) ? location.lng : DEFAULT_LOCATION.lng,
    });
    onClose();
  };

  const handleLocate = () => {
    if (navigator.geolocation && mapInstanceRef.current && markerRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const lat = Number(latitude);
          const lng = Number(longitude);
          if (!isNaN(lat) && !isNaN(lng)) {
            const newLocation = { lat, lng };
            setTempLocation(newLocation);
            
            const map = mapInstanceRef.current;
            map.setView([latitude, longitude], 15, { animate: true });
            
            const marker = markerRef.current;
            marker.setLatLng([latitude, longitude]);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Select Property Location"
      description="Drag the red marker to set your property location. You can also use the locate button to find your current position."
      maxWidth="4xl"
    >
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        {/* Instructions */}
        <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Navigation className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-blue-900 font-medium mb-1">How to use:</p>
            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
              <li>Drag the red marker to your property location</li>
              <li>Use pinch-to-zoom or scroll wheel to zoom in/out</li>
              <li>Click "Locate Me" to use your current location</li>
              <li>Switch between Map and Satellite views</li>
            </ul>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-xl overflow-hidden border-2 border-gray-200 shadow-inner">
          <div ref={mapRef} className="w-full h-full" />
          
          {/* Loading State */}
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-200 border-t-sky-600 mx-auto mb-4"></div>
                <p className="text-sm font-medium text-gray-700">Loading map...</p>
                <p className="text-xs text-gray-500 mt-1">Please wait</p>
              </div>
            </div>
          )}

          {/* Map Layer Toggle */}
          {mapLoaded && (
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[1000] flex gap-2">
              <Button
                variant={mapLayer === 'street' ? 'primary' : 'outline'}
                onClick={() => setMapLayer('street')}
                size="sm"
                className="shadow-lg text-xs sm:text-sm px-3 sm:px-4"
              >
                Map
              </Button>
              <Button
                variant={mapLayer === 'satellite' ? 'primary' : 'outline'}
                onClick={() => setMapLayer('satellite')}
                size="sm"
                className="shadow-lg text-xs sm:text-sm px-3 sm:px-4"
              >
                Satellite
              </Button>
            </div>
          )}

          {/* Locate Button */}
          {mapLoaded && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLocate}
              className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-[1000] w-11 h-11 sm:w-12 sm:h-12 p-0 shadow-lg hover:shadow-xl transition-shadow"
              leftIcon={<Locate size={18} className="sm:w-5 sm:h-5" />}
              title="Use my current location"
            />
          )}
        </div>

        {/* Location Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="p-2 bg-sky-100 rounded-lg flex-shrink-0">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 mb-1">Selected Coordinates</p>
              <p className="text-sm sm:text-base font-mono font-medium text-gray-900 break-all">
                {Number(tempLocation.lat).toFixed(6)}, {Number(tempLocation.lng).toFixed(6)}
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {locationError && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">{locationError}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isFetchingLocation}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleConfirm}
            disabled={isFetchingLocation}
            className="w-full sm:w-auto"
            leftIcon={isFetchingLocation ? <Loader2 className="animate-spin" size={18} /> : undefined}
          >
            {isFetchingLocation ? 'Fetching Location...' : 'Confirm Location'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LocationPickerModal;
