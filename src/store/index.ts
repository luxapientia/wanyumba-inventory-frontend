import { configureStore } from '@reduxjs/toolkit';
import propertiesReducer from './slices/propertiesSlice.js';
import scrapedPropertiesReducer from './slices/scrapedPropertiesSlice.js';
import userReducer from './slices/userSlice.js';

const store = configureStore({
  reducer: {
    properties: propertiesReducer,
    scrapedProperties: scrapedPropertiesReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp', 'payload.createdAt', 'payload.updatedAt'],
      },
    }),
});

export { store };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

