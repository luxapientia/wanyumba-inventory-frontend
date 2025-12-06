import { createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../api/user.service.js';
import { setUser, setLoading, setError, clearUser } from '../slices/userSlice.js';

// Wanyumba frontend URL for redirecting unauthorized users
const WANYUMBA_FRONTEND_URL = import.meta.env.VITE_WANYUMBA_FRONTEND_URL || 'http://localhost:3000';
const LOGIN_PATH = '/auth/login';

/**
 * Redirect to wanyumba-frontend login page
 */
const redirectToLogin = () => {
  const loginUrl = `${WANYUMBA_FRONTEND_URL}${LOGIN_PATH}`;
  // Use window.location.href for full page redirect (clears React state)
  window.location.href = loginUrl;
};

/**
 * Check if response indicates unauthorized access
 */
const isUnauthorizedResponse = (response: unknown): boolean => {
  if (!response || typeof response !== 'object') return false;
  
  const resp = response as Record<string, unknown>;
  
  // Check for unauthorized error in response data
  if (resp.error) {
    const error = resp.error as Record<string, unknown>;
    if (error.type === 'UNAUTHORIZED' || 
        (typeof error.message === 'string' && 
         (error.message.toLowerCase().includes('unauthorized') ||
          error.message.toLowerCase().includes('no token')))) {
      return true;
    }
  }
  
  // Check if success is false and message indicates unauthorized
  if (resp.success === false) {
    const message = typeof resp.message === 'string' ? resp.message.toLowerCase() : '';
    if (message.includes('unauthorized') || message.includes('no token')) {
      return true;
    }
  }
  
  return false;
};

/**
 * Fetch current user info
 */
export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await userService.getCurrentUser();
      
      // Check if response indicates unauthorized access
      // (Note: HTTP 401 is handled by axios interceptor, but we check response data here)
      if (isUnauthorizedResponse(response)) {
        // Clear user state
        dispatch(clearUser());
        // Redirect to login
        redirectToLogin();
        // Return early to prevent further processing
        return;
      }
      
      if (response.success && response.data?.user) {
        dispatch(setUser(response.data.user));
        return response.data.user;
      } else {
        throw new Error(response.message || 'Failed to fetch user');
      }
    } catch (error: unknown) {
      // HTTP 401 errors are handled by axios interceptor (which redirects)
      // But we also check response data for unauthorized indicators
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string };
      if (axiosError.response && axiosError.response.status === 401) {
        // Axios interceptor will handle redirect, but clear state here
        dispatch(clearUser());
        return;
      }
      
      // Check if error response data indicates unauthorized
      if (isUnauthorizedResponse(axiosError.response?.data)) {
        dispatch(clearUser());
        redirectToLogin();
        return;
      }
      
      const errorResponse = axiosError.response?.data as { message?: string } | undefined;
      const errorMessage = errorResponse?.message || axiosError.message || 'Failed to fetch user';
      dispatch(setError(errorMessage));
      throw error;
    }
  }
);

