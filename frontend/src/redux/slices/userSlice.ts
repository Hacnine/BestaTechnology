import { createSlice } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { userApi } from "../api/userApi";
import { RootState } from "../store";

// Initial State
const initialState = {
  user: null,
  isAuthenticated: null,
  loading: false,
  error: null,
};

// Slice Definition
const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    reset: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(userApi.endpoints.login.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(userApi.endpoints.login.matchFulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload.user;
        state.user = user;
        state.isAuthenticated = true; // 👈 Marks login success
      })
      .addMatcher(userApi.endpoints.login.matchRejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.isAuthenticated = false; 
      })
      .addMatcher(
        userApi.endpoints.userInfo.matchFulfilled,
        (state, action) => {
          state.loading = false;
          const user = action.payload.user; // Or action.payload, depending on response
          state.user = user;
          state.isAuthenticated = true;
        }
      )
      .addMatcher(userApi.endpoints.logout.matchFulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false; 
      });
  },
});

// Actions & Reducer
export const { setCredentials, logout, clearError, reset } = userSlice.actions;
export default userSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.userSlice.user;
export const selectAuthLoading = (state) => state.userSlice.loading;
export const selectAuthError = (state) => state.userSlice.error;
export const selectIsAuthenticated = (state) => state.userSlice.isAuthenticated;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useUser = () => useAppSelector((state) => state.userSlice);
