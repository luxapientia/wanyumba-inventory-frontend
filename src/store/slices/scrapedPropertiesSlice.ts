import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  ScrapedProperty,
  ScrapedPropertiesFilters,
} from '../../api/types.js';

interface ScrapedPropertiesState {
  items: ScrapedProperty[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  loading: boolean;
  error: string | null;
  filters: ScrapedPropertiesFilters;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  search: string;
  propertyTypes: string[]; // Property types from scraper service
}

const initialState: ScrapedPropertiesState = {
  items: [],
  total: 0,
  page: 1,
  limit: 20,
  pages: 0,
  loading: false,
  error: null,
  filters: {
    page: 1,
    limit: 20,
    sortBy: 'created_at',
    sortOrder: 'desc',
    search: '',
  },
  sortBy: 'created_at',
  sortOrder: 'desc',
  search: '',
  propertyTypes: [], // Property types from scraper service
};

const scrapedPropertiesSlice = createSlice({
  name: 'scrapedProperties',
  initialState,
  reducers: {
    setScrapedProperties: (
      state,
      action: PayloadAction<{
        properties: ScrapedProperty[];
        total: number;
        page: number;
        limit: number;
        pages: number;
      }>
    ) => {
      state.items = action.payload.properties;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.pages = action.payload.pages;
      state.loading = false;
      state.error = null;
    },
    setScrapedLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setScrapedError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setScrapedPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
      state.filters.page = action.payload;
    },
    setScrapedLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.filters.limit = action.payload;
      state.page = 1;
      state.filters.page = 1;
    },
    setScrapedFilters: (
      state,
      action: PayloadAction<Partial<ScrapedPropertiesFilters>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
      state.filters.page = 1;
    },
    setScrapedSorting: (
      state,
      action: PayloadAction<{ sortBy: string; sortOrder: 'asc' | 'desc' }>
    ) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
      state.filters.sortBy = action.payload.sortBy;
      state.filters.sortOrder = action.payload.sortOrder;
      state.page = 1;
      state.filters.page = 1;
    },
    setScrapedSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.filters.search = action.payload;
      state.page = 1;
      state.filters.page = 1;
    },
    clearScrapedFilters: (state) => {
      state.filters = {
        page: state.page,
        limit: state.limit,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        search: '',
      };
      state.search = '';
    },
    setScrapedPropertyTypes: (state, action: PayloadAction<string[]>) => {
      state.propertyTypes = action.payload;
    },
    resetScrapedProperties: () => initialState,
  },
});

export const {
  setScrapedProperties,
  setScrapedLoading,
  setScrapedError,
  setScrapedPage,
  setScrapedLimit,
  setScrapedFilters,
  setScrapedSorting,
  setScrapedSearch,
  clearScrapedFilters,
  setScrapedPropertyTypes,
  resetScrapedProperties,
} = scrapedPropertiesSlice.actions;

export default scrapedPropertiesSlice.reducer;

