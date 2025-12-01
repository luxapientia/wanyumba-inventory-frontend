import { createAsyncThunk } from '@reduxjs/toolkit';
import propertiesService from '../../api/properties.service.js';
import {
  setScrapedProperties,
  setScrapedLoading,
  setScrapedError,
  setScrapedPropertyTypes,
} from '../slices/scrapedPropertiesSlice.js';
import type { RootState } from '../index.js';
import type { ScrapedPropertiesFilters } from '../../api/types.js';

/**
 * Get scraped properties by phone number with pagination, filtering, searching, and sorting.
 * Phone number is handled server-side.
 * Uses Redux state for filters, pagination, sorting, and search if not provided.
 */
export const fetchScrapedPropertiesByPhone = createAsyncThunk(
  'scrapedProperties/fetchByPhone',
  async (filters: ScrapedPropertiesFilters | undefined, { dispatch, getState }) => {
    dispatch(setScrapedLoading(true));
    try {
      const state = getState() as RootState;
      const { scrapedProperties } = state;
      const { filters: scrapedFilters, page, limit, sortBy, sortOrder, search } = scrapedProperties;

      // Use provided filters or fall back to Redux state
      const filtersToSend: ScrapedPropertiesFilters = filters || {
        ...scrapedFilters,
        page,
        limit,
        sortBy,
        sortOrder,
        search: search || undefined,
      };

      const response = await propertiesService.getScrapedPropertiesByPhone(filtersToSend);

      dispatch(
        setScrapedProperties({
          properties: response.listings,
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
          : 'Failed to fetch scraped properties';
      dispatch(setScrapedError(message));
      throw error;
    }
  }
);

/**
 * Fetch property types from the scraper service
 */
export const fetchScrapedPropertyTypes = createAsyncThunk(
  'scrapedProperties/fetchPropertyTypes',
  async (_, { dispatch }) => {
    try {
      const propertyTypes = await propertiesService.getPropertyTypesFromScrapper();
      dispatch(setScrapedPropertyTypes(propertyTypes));
      return propertyTypes;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch scraped property types';
      console.error(message);
      // Return empty array on error instead of throwing
      dispatch(setScrapedPropertyTypes([]));
      return [];
    }
  }
);

