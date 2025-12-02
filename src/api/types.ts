// Property Status
export type PropertyStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'ACTIVE'
  | 'REJECTED'
  | 'SOLD'
  | 'RENTED';

export const PropertyStatusValues = {
  DRAFT: 'DRAFT' as const,
  PENDING: 'PENDING' as const,
  ACTIVE: 'ACTIVE' as const,
  REJECTED: 'REJECTED' as const,
  SOLD: 'SOLD' as const,
  RENTED: 'RENTED' as const,
} as const;

// Media Type
export interface Media {
  id: string;
  listingId: string;
  type: string;
  url: string;
  thumbnailUrl?: string;
  order: number;
  createdAt: string;
}

// Real Estate Property
export interface RealEstateProperty {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  listingType: string;
  status: PropertyStatus;
  price: number;
  currency: string;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  landSize?: number;
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;
  address: string;
  district?: string;
  region?: string;
  ward?: string;
  latitude?: number;
  longitude?: number;
  features?: Record<string, unknown>;
  ownerId: string;
  ownerType: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  views: number;
  favorites: number;
  inquiries: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  expiresAt?: string;
  moderatedBy?: string;
  moderatedAt?: string;
  rejectionReason?: string;
  media?: Media[];
}

// Create Property DTO
export interface CreatePropertyDto {
  title: string;
  description?: string;
  propertyType: string;
  listingType: string;
  price: number;
  currency?: string;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  landSize?: number;
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;
  address: string;
  district?: string;
  region?: string;
  ward?: string;
  latitude?: number;
  longitude?: number;
  features?: Record<string, unknown>;
  ownerType: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  expiresAt?: string;
  scrapedPropertyId?: string; // ID of the scraped property this listing originated from
}

// Update Property DTO
export interface UpdatePropertyDto {
  title?: string;
  description?: string;
  propertyType?: string;
  listingType?: string;
  status?: PropertyStatus;
  price?: number;
  currency?: string;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  landSize?: number;
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;
  address?: string;
  district?: string;
  region?: string;
  ward?: string;
  latitude?: number;
  longitude?: number;
  features?: Record<string, unknown>;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  expiresAt?: string;
  rejectionReason?: string;
}

// Property Filters
export interface PropertyFilters {
  status?: PropertyStatus;
  propertyType?: string;
  listingType?: string;
  district?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  ownerId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// Pagination Response
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Properties Response
export interface PropertiesResponse {
  properties: RealEstateProperty[];
  pagination: PaginationMeta;
}

// API Response Wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    type?: string;
    message?: string;
    context?: unknown;
  };
  timestamp?: string;
}

// Scraped Property (from scraper service)
// Based on the scraper service's ListingBase schema and to_dict output
export interface ScrapedProperty {
  rawUrl: string;
  source: string;
  sourceListingId?: string | null;
  scrapeTimestamp?: string | null;
  title?: string | null;
  description?: string | null;
  propertyType?: string | null;
  listingType?: string | null;
  status?: string | null;
  price?: number | null;
  priceCurrency?: string | null;
  pricePeriod?: string | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  district?: string | null;
  addressText?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  livingAreaSqm?: number | null;
  landAreaSqm?: number | null;
  images?: string[] | null;
  agentName?: string | null;
  agentPhone?: string | null;
  agentWhatsapp?: string | null;
  agentEmail?: string | null;
  agentWebsite?: string | null;
  agentProfileUrl?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  // Additional fields that might be present
  [key: string]: unknown;
}

// Scraped Properties Response
export interface ScrapedPropertiesResponse {
  listings: ScrapedProperty[];
  pagination: PaginationMeta;
}

// Scraped Properties Filters
export interface ScrapedPropertiesFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  source?: string;
  propertyType?: string | undefined;
  listingType?: string | undefined;
  minPrice?: number;
  maxPrice?: number;
}

