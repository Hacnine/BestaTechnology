import { configureStore, Middleware } from "@reduxjs/toolkit";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { userApi } from "./api/userApi";
import { auditApi } from "./api/auditApi";
import { dashboardApi } from "./api/dashboardApi";
import { tnaApi } from "./api/tnaApi";
import userReducer from "./slices/userSlice";
import { employeeApi } from "./api/employeeApi";
import { merchandiserApi } from "./api/merchandiserApi";
import { cadApi } from "./api/cadApi";
import { sampleDevelopmentApi } from "./api/sampleDevelopementApi";
import { fabricBookingApi } from "./api/fabricBooking";
import { dhlTrackingApi } from "./api/dHLTrackingApi";
import { buyerApi } from "./api/buyerApi";
import { costSheetApi } from "./api/costSheetApi";
import { trimsAndAccessoriesApi } from "./api/trimsAndAccessoriesApi";

// No-op storage for server-side rendering
const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
});

const storageEngine =
  typeof window !== "undefined" ? storage : createNoopStorage();

// Factory function for persist config
const createPersistConfig = (key: string, options = {}) => ({
  key,
  storage: storageEngine,
  ...options,
});

// Persist config for userSlice
const userPersistConfig = createPersistConfig("userSlice", {
  whitelist: ["isAuthenticated", "user"],
});

// Wrap userReducer with persistReducer
const reducers = {
  userSlice: persistReducer(userPersistConfig, userReducer),
  [userApi.reducerPath]: userApi.reducer,
  [buyerApi.reducerPath]: buyerApi.reducer,
  [employeeApi.reducerPath]: employeeApi.reducer,
  [auditApi.reducerPath]: auditApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
  [tnaApi.reducerPath]: tnaApi.reducer,
  [merchandiserApi.reducerPath]: merchandiserApi.reducer,
  [cadApi.reducerPath]: cadApi.reducer,
  [sampleDevelopmentApi.reducerPath]: sampleDevelopmentApi.reducer,
  [fabricBookingApi.reducerPath]: fabricBookingApi.reducer,
  [dhlTrackingApi.reducerPath]: dhlTrackingApi.reducer,
  [costSheetApi.reducerPath]: costSheetApi.reducer,
  [trimsAndAccessoriesApi.reducerPath]: trimsAndAccessoriesApi.reducer,
};

// Configure store
export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist action types that may contain non-serializable values
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([
      userApi.middleware,
      buyerApi.middleware,
      employeeApi.middleware,
      auditApi.middleware,
      dashboardApi.middleware,
      tnaApi.middleware,
      merchandiserApi.middleware,
      cadApi.middleware,
      sampleDevelopmentApi.middleware,
      fabricBookingApi.middleware,
      dhlTrackingApi.middleware,
      costSheetApi.middleware,
        trimsAndAccessoriesApi.middleware,
    ] as Middleware[]),
});

// Persistor for use in your app (e.g., <PersistGate>)
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
