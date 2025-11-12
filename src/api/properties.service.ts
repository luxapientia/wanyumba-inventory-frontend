import apiClient from './axios.js';
import type {
  CreatePropertyDto,
  UpdatePropertyDto,
  RealEstateProperty,
  PropertyFilters,
  PropertiesResponse,
  ScrapedPropertiesResponse,
  ScrapedPropertiesFilters,
  ApiResponse,
} from './types.js';

/**
 * Properties Service
 * Handles all API calls related to property management
 */
class PropertiesService {
  private readonly API_PREFIX = '/properties';

  /**
   * Create a new property
   * Sends data as multipart/form-data to support file uploads
   */
  async createProperty(data: CreatePropertyDto, images?: File[]): Promise<RealEstateProperty> {
    const formData = new FormData();

    // Add all property fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'features' && typeof value === 'object') {
          // Stringify JSON fields
          formData.append(key, JSON.stringify(value));
        } else if (value instanceof Date) {
          // Convert Date to ISO string
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Add image files
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await apiClient.post<ApiResponse<RealEstateProperty>>(
      this.API_PREFIX,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create property');
    }
    return response.data.data;
  }

  /**
   * Get a property by ID
   */
  async getPropertyById(id: string): Promise<RealEstateProperty> {
    const response = await apiClient.get<ApiResponse<RealEstateProperty>>(
      `${this.API_PREFIX}/${id}`
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch property');
    }
    return response.data.data;
  }

  /**
   * Get all properties with filters, pagination, and sorting
   */
  async getProperties(filters: PropertyFilters): Promise<PropertiesResponse> {
    const response = await apiClient.get<ApiResponse<PropertiesResponse>>(
      this.API_PREFIX,
      { params: filters }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch properties');
    }
    return response.data.data;
  }

  /**
   * Update an existing property
   */
  async updateProperty(
    id: string,
    data: UpdatePropertyDto
  ): Promise<RealEstateProperty> {
    const response = await apiClient.put<ApiResponse<RealEstateProperty>>(
      `${this.API_PREFIX}/${id}`,
      data
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update property');
    }
    return response.data.data;
  }

  /**
   * Delete a property
   */
  async deleteProperty(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${this.API_PREFIX}/${id}`
    );
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete property');
    }
  }

  /**
   * Increment property views
   */
  async incrementViews(id: string): Promise<void> {
    const response = await apiClient.post<ApiResponse<void>>(
      `${this.API_PREFIX}/${id}/views`
    );
    if (!response.data.success) {
      throw new Error(
        response.data.message || 'Failed to increment property views'
      );
    }
  }

  /**
   * Get scraped properties by phone number with pagination, filtering, searching, and sorting.
   * Phone number is handled server-side (hardcoded for now).
   */
  async getScrapedPropertiesByPhone(
    filters?: ScrapedPropertiesFilters
  ): Promise<ScrapedPropertiesResponse> {
    const response = await apiClient.get<ApiResponse<ScrapedPropertiesResponse>>(
      `${this.API_PREFIX}/scraped/by-phone`,
      { params: filters }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.message || 'Failed to fetch scraped properties'
      );
    }
    return response.data.data;
  }

  /**
   * Get all unique property types from the scraper service
   */
  async getPropertyTypes(): Promise<string[]> {
    const response = await apiClient.get<ApiResponse<string[]>>(
      `${this.API_PREFIX}/property-types`
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.message || 'Failed to fetch property types'
      );
    }
    return response.data.data;
  }
}

export default new PropertiesService();

