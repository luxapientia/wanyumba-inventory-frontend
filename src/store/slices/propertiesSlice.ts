import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  RealEstateProperty,
  PropertyFilters,
} from '../../api/types.js';

interface PropertiesState {
  items: RealEstateProperty[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  loading: boolean;
  error: string | null;
  filters: PropertyFilters;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  selectedProperty: RealEstateProperty | null;
}

const initialState: PropertiesState = {
  items: [],
  total: 0,
  page: 1,
  limit: 20,
  pages: 0,
  loading: false,
  error: null,
  filters: {
    status: undefined,
    propertyType: undefined,
    listingType: undefined,
    district: undefined,
    region: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    minBedrooms: undefined,
    ownerId: undefined,
    page: 1,
    limit: 20,
  },
  sortBy: 'createdAt',
  sortOrder: 'desc',
  selectedProperty: null,
};

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setProperties: (
      state,
      action: PayloadAction<{
        listings: RealEstateProperty[];
        total: number;
        page: number;
        limit: number;
        pages: number;
      }>
    ) => {
      state.items = action.payload.listings;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.pages = action.payload.pages;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
      state.filters.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.filters.limit = action.payload;
      state.page = 1; // Reset to first page when changing limit
      state.filters.page = 1;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<PropertyFilters>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1; // Reset to first page when filters change
      state.filters.page = 1;
    },
    clearFilters: (state) => {
      state.filters = {
        ...initialState.filters,
        page: state.page,
        limit: state.limit,
      };
    },
    setSorting: (
      state,
      action: PayloadAction<{ sortBy: string; sortOrder: 'asc' | 'desc' }>
    ) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
      state.page = 1; // Reset to first page when sorting changes
      state.filters.page = 1;
    },
    addProperty: (state, action: PayloadAction<RealEstateProperty>) => {
      state.items.unshift(action.payload);
      state.total += 1;
      state.pages = Math.ceil(state.total / state.limit);
    },
    updateProperty: (state, action: PayloadAction<RealEstateProperty>) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      // Also update if it's the selected property
      if (
        state.selectedProperty &&
        state.selectedProperty.id === action.payload.id
      ) {
        state.selectedProperty = action.payload;
      }
    },
    removeProperty: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = Math.max(0, state.total - 1);
      state.pages = Math.ceil(state.total / state.limit);
      // Clear selected property if it was deleted
      if (
        state.selectedProperty &&
        state.selectedProperty.id === action.payload
      ) {
        state.selectedProperty = null;
      }
    },
    setSelectedProperty: (
      state,
      action: PayloadAction<RealEstateProperty | null>
    ) => {
      state.selectedProperty = action.payload;
    },
    resetProperties: () => initialState,
  },
});

export const {
  setProperties,
  setLoading,
  setError,
  setPage,
  setLimit,
  setFilters,
  clearFilters,
  setSorting,
  addProperty,
  updateProperty,
  removeProperty,
  setSelectedProperty,
  resetProperties,
} = propertiesSlice.actions;

export default propertiesSlice.reducer;

