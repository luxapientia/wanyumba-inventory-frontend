import { createAsyncThunk } from '@reduxjs/toolkit';
import propertiesService from '../../api/properties.service.js';
import {
  setProperties,
  setLoading,
  setError,
} from '../slices/propertiesSlice.js';
import type { RootState } from '../index.js';
import type {
  CreatePropertyDto,
  UpdatePropertyDto,
  ScrapedPropertiesFilters,
} from '../../api/types.js';

/**
 * Fetch properties from the backend with current filters, sorting, search, and pagination
 */
export const fetchProperties = createAsyncThunk(
  'properties/fetch',
  async (_, { dispatch, getState }) => {
    dispatch(setLoading(true));
    try {
      const state = getState() as RootState;
      const { page, limit, filters, sortBy, sortOrder, search } = state.properties;

      // Build filters object with all current state values
      const filtersToSend: typeof filters = {
        ...filters,
        page,
        limit,
        sortBy,
        sortOrder,
        search: search || undefined,
      };

      const response = await propertiesService.getProperties(filtersToSend);

      dispatch(
        setProperties({
          listings: response.properties,
          total: response.pagination.total,
          page: response.pagination.page,
          limit: response.pagination.limit,
          pages: response.pagination.pages,
        })
      );

      return response;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch properties';
      dispatch(setError(message));
      throw error;
    }
  }
);

/**
 * Fetch a single property by ID
 */
export const fetchPropertyById = createAsyncThunk(
  'properties/fetchById',
  async (id: string, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const listing = await propertiesService.getPropertyById(id);
      dispatch(setLoading(false));
      return listing;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch property';
      dispatch(setError(message));
      throw error;
    }
  }
);

/**
 * Create a new property
 */
export const createProperty = createAsyncThunk(
  'properties/create',
  async (data: CreatePropertyDto, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const listing = await propertiesService.createProperty(data);
      dispatch(setLoading(false));
      // Refetch properties to get updated list
      dispatch(fetchProperties());
      return listing;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create property';
      dispatch(setError(message));
      throw error;
    }
  }
);

/**
 * Update an existing property
 */
export const updateProperty = createAsyncThunk(
  'properties/update',
  async (
    { id, data }: { id: string; data: UpdatePropertyDto },
    { dispatch }
  ) => {
    dispatch(setLoading(true));
    try {
      const listing = await propertiesService.updateProperty(id, data);
      dispatch(setLoading(false));
      // Refetch properties to get updated list
      dispatch(fetchProperties());
      return listing;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update property';
      dispatch(setError(message));
      throw error;
    }
  }
);

/**
 * Delete a property
 */
export const deleteProperty = createAsyncThunk(
  'properties/delete',
  async (id: string, { dispatch }) => {
    try {
      await propertiesService.deleteProperty(id);
      // Refetch properties after deletion
      dispatch(fetchProperties());
      return id;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete property';
      dispatch(setError(message));
      throw error;
    }
  }
);

/**
 * Increment property views
 */
export const incrementViews = createAsyncThunk(
  'properties/incrementViews',
  async (id: string, { dispatch }) => {
    try {
      await propertiesService.incrementViews(id);
      // Refetch properties to get updated view count
      dispatch(fetchProperties());
      return id;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to increment views';
      dispatch(setError(message));
      throw error;
    }
  }
);

/**
 * Get scraped properties by phone number with pagination, filtering, searching, and sorting.
 * Phone number is handled server-side.
 */
export const fetchScrapedPropertiesByPhone = createAsyncThunk(
  'properties/fetchScrapedByPhone',
  async (filters: ScrapedPropertiesFilters = {}, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await propertiesService.getScrapedPropertiesByPhone(filters);
      dispatch(setLoading(false));
      return response;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch scraped properties';
      dispatch(setError(message));
      throw error;
    }
  }
);

