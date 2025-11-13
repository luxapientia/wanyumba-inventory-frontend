import apiClient from './axios.js';
import type {
  CreatePropertyDto,
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
  async createProperty(
    data: CreatePropertyDto,
    images?: File[],
    imageUrls?: string[]
  ): Promise<RealEstateProperty> {
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

    // Add image URLs (for scraped properties)
    if (imageUrls && imageUrls.length > 0) {
      formData.append('imageUrls', JSON.stringify(imageUrls));
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
   * Update a property
   * Sends data as multipart/form-data to support file uploads
   */
  async updateProperty(
    id: string,
    data: Partial<CreatePropertyDto>,
    images?: File[],
    imageUrls?: string[],
    removedImageIds?: string[]
  ): Promise<RealEstateProperty> {
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

    // Add image URLs (for scraped properties)
    if (imageUrls && imageUrls.length > 0) {
      formData.append('imageUrls', JSON.stringify(imageUrls));
    }

    // Add removed image IDs
    if (removedImageIds && removedImageIds.length > 0) {
      formData.append('removedImageIds', JSON.stringify(removedImageIds));
    }

    

    const response = await apiClient.put<ApiResponse<RealEstateProperty>>(
      `${this.API_PREFIX}/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update property');
    }
    return response.data.data;
  }

  /**
   * Get all properties with filters, pagination, sorting, and search
   * Supports server-side pagination, sorting, searching, and filtering
   */
  async getProperties(filters: PropertyFilters): Promise<PropertiesResponse> {
    // Build query params, excluding undefined values
    const params: Record<string, string | number> = {};
    
    if (filters.status) params.status = filters.status;
    if (filters.propertyType) params.propertyType = filters.propertyType;
    if (filters.listingType) params.listingType = filters.listingType;
    if (filters.district) params.district = filters.district;
    if (filters.region) params.region = filters.region;
    if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
    if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
    if (filters.minBedrooms !== undefined) params.minBedrooms = filters.minBedrooms;
    if (filters.ownerId) params.ownerId = filters.ownerId;
    if (filters.page !== undefined) params.page = filters.page;
    if (filters.limit !== undefined) params.limit = filters.limit;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;
    if (filters.search) params.search = filters.search;

    const response = await apiClient.get<ApiResponse<PropertiesResponse>>(
      this.API_PREFIX,
      { params }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch properties');
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
   * Publish property (set status to PENDING)
   */
  async publishProperty(id: string): Promise<RealEstateProperty> {
    const response = await apiClient.post<ApiResponse<RealEstateProperty>>(
      `${this.API_PREFIX}/${id}/publish`
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to publish property');
    }
    return response.data.data;
  }

  /**
   * Activate property - Admin action to approve and make property public (set status to ACTIVE)
   */
  async activateProperty(id: string): Promise<RealEstateProperty> {
    const response = await apiClient.post<ApiResponse<RealEstateProperty>>(
      `${this.API_PREFIX}/${id}/activate`
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to activate property');
    }
    return response.data.data;
  }

  /**
   * Reject property - Admin action to reject property submission (set status to REJECTED)
   */
  async rejectProperty(id: string, rejectionReason: string): Promise<RealEstateProperty> {
    const response = await apiClient.post<ApiResponse<RealEstateProperty>>(
      `${this.API_PREFIX}/${id}/reject`,
      { rejectionReason }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to reject property');
    }
    return response.data.data;
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
   * Get all unique property types from the database (RealEstateListing table)
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

  /**
   * Get all unique property types from the scraper service
   */
  async getPropertyTypesFromScrapper(): Promise<string[]> {
    const response = await apiClient.get<ApiResponse<string[]>>(
      `${this.API_PREFIX}/property-types/scraper`
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.message || 'Failed to fetch property types from scraper'
      );
    }
    return response.data.data;
  }
}

export default new PropertiesService();

