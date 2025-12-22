export { default as apiClient } from './axios.js';
export { default as propertiesService } from './properties.service.js';
export { default as geocodingService } from './geocoding.service.js';
// Keep listingsService as alias for backward compatibility (deprecated)
export { default as listingsService } from './properties.service.js';
export * from './types.js';
export * from './speechToTextService.js';
export type {
  GeocodingResult,
  ForwardGeocodingRequest,
  ForwardGeocodingResponse,
  ReverseGeocodingRequest,
  ReverseGeocodingResponse,
} from './geocoding.service.js';

