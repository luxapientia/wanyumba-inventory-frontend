import axios from 'axios';
import type { AxiosInstance } from 'axios';

/**
 * Geocoding API Types
 * Based on the geocoding microservice schemas
 */

// Geocoding Result
export interface GeocodingResult {
  latitude: number;
  longitude: number;
  formatted_address: string;
  confidence: number; // 0-1
  street?: string | null;
  city?: string | null;
  district?: string | null;
  region?: string | null;
  country?: string | null;
  postal_code?: string | null;
  place_id?: string | null;
  types: string[];
  metadata: Record<string, unknown>;
}

// Forward Geocoding Request
export interface ForwardGeocodingRequest {
  address: string;
  limit?: number; // 1-50, default: 10
  country?: string | null; // Country code to limit search
}

// Forward Geocoding Response
export interface ForwardGeocodingResponse {
  query: string;
  results: GeocodingResult[];
  total_results: number;
  processing_time_ms: number;
}

// Reverse Geocoding Request
export interface ReverseGeocodingRequest {
  latitude: number; // -90 to 90
  longitude: number; // -180 to 180
  radius?: number; // 1-10000 meters, default: 1000
}

// Reverse Geocoding Response
export interface ReverseGeocodingResponse {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  results: GeocodingResult[];
  total_results: number;
  processing_time_ms: number;
}

/**
 * Geocoding Service
 * Handles all API calls to the geocoding microservice
 */
class GeocodingService {
  private readonly apiClient: AxiosInstance;
  private readonly API_PREFIX = '/geocoding';

  constructor() {
    // Geocoding service URL - can be configured via environment variable
    // IMPORTANT: All API calls go through the API Gateway (Traefik)
    // Default to Traefik gateway URL (port 80)
    // Traefik routes /api/v1/geocoding/* to geocoding service (port 8001)
    const GEOCODING_API_URL =
      import.meta.env.VITE_GEOCODING_API_URL || 'http://localhost/api/v1';

    // Create axios instance for geocoding service
    this.apiClient = axios.create({
      baseURL: GEOCODING_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    });

    // Request interceptor
    this.apiClient.interceptors.request.use(
      (config) => {
        // Add auth token if available (for future use)
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.apiClient.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // Handle common errors
        if (error.response?.status === 429) {
          // Rate limit exceeded
          throw new Error('Too many requests. Please try again later.');
        }
        if (error.response?.status === 500) {
          throw new Error('Geocoding service error. Please try again.');
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Forward Geocoding: Convert address string to coordinates
   * @param request - Forward geocoding request
   * @returns Geocoding results with coordinates
   */
  async forwardGeocoding(
    request: ForwardGeocodingRequest
  ): Promise<ForwardGeocodingResponse> {
    try {
      const response = await this.apiClient.post<ForwardGeocodingResponse>(
        `${this.API_PREFIX}/forward`,
        {
          address: request.address,
          limit: request.limit || 10,
          country: request.country || null,
        }
      );

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Forward geocoding failed: ${error.message}`);
      }
      throw new Error('Forward geocoding failed: Unknown error');
    }
  }

  /**
   * Reverse Geocoding: Convert coordinates to formatted address
   * @param request - Reverse geocoding request
   * @returns Address information for the coordinates
   */
  async reverseGeocoding(
    request: ReverseGeocodingRequest
  ): Promise<ReverseGeocodingResponse> {
    try {
      const response = await this.apiClient.post<ReverseGeocodingResponse>(
        `${this.API_PREFIX}/reverse`,
        {
          latitude: request.latitude,
          longitude: request.longitude,
          radius: request.radius || 1000,
        }
      );

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Reverse geocoding failed: ${error.message}`);
      }
      throw new Error('Reverse geocoding failed: Unknown error');
    }
  }

  /**
   * Reverse Geocoding (GET method): Convert coordinates to formatted address
   * Alternative method using GET request
   */
  async reverseGeocodingGet(
    latitude: number,
    longitude: number,
    radius: number = 1000
  ): Promise<ReverseGeocodingResponse> {
    try {
      const response = await this.apiClient.get<ReverseGeocodingResponse>(
        `${this.API_PREFIX}/reverse`,
        {
          params: {
            latitude,
            longitude,
            radius,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Reverse geocoding failed: ${error.message}`);
      }
      throw new Error('Reverse geocoding failed: Unknown error');
    }
  }

  /**
   * Forward Geocoding (GET method): Convert address string to coordinates
   * Alternative method using GET request
   */
  async forwardGeocodingGet(
    address: string,
    limit: number = 10,
    country?: string | null
  ): Promise<ForwardGeocodingResponse> {
    try {
      const params: Record<string, string | number> = {
        address,
        limit,
      };
      if (country) {
        params.country = country;
      }

      const response = await this.apiClient.get<ForwardGeocodingResponse>(
        `${this.API_PREFIX}/forward`,
        { params }
      );

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Forward geocoding failed: ${error.message}`);
      }
      throw new Error('Forward geocoding failed: Unknown error');
    }
  }

  /**
   * Get coordinates from address string (convenience method)
   * Returns the best match's coordinates directly
   * @param address - Address string to geocode
   * @param country - Optional country code to limit search
   * @returns Object with latitude and longitude, or null if no results
   */
  async getCoordinatesFromAddress(
    address: string,
    country?: string | null
  ): Promise<{ latitude: number; longitude: number; formatted_address: string } | null> {
    try {
      const response = await this.forwardGeocoding({
        address,
        limit: 1, // Only need the best match
        country,
      });

      if (response.results && response.results.length > 0) {
        const bestResult = response.results[0];
        return {
          latitude: bestResult.latitude,
          longitude: bestResult.longitude,
          formatted_address: bestResult.formatted_address,
        };
      }

      return null;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get coordinates from address: ${error.message}`);
      }
      throw new Error('Failed to get coordinates from address: Unknown error');
    }
  }

  /**
   * Get multiple coordinate results from address string
   * Useful when you want to show multiple location options to the user
   * @param address - Address string to geocode
   * @param limit - Maximum number of results (default: 10)
   * @param country - Optional country code to limit search
   * @returns Array of coordinate results with address information
   */
  async getCoordinatesFromAddressMultiple(
    address: string,
    limit: number = 10,
    country?: string | null
  ): Promise<Array<{ latitude: number; longitude: number; formatted_address: string; confidence: number }>> {
    try {
      const response = await this.forwardGeocoding({
        address,
        limit,
        country,
      });

      if (response.results && response.results.length > 0) {
        return response.results.map((result) => ({
          latitude: result.latitude,
          longitude: result.longitude,
          formatted_address: result.formatted_address,
          confidence: result.confidence,
        }));
      }

      return [];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get coordinates from address: ${error.message}`);
      }
      throw new Error('Failed to get coordinates from address: Unknown error');
    }
  }
}

export default new GeocodingService();

