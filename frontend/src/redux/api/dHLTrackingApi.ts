import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import ulr from "@/config/urls";

export const dhlTrackingApi = createApi({
  reducerPath: "dhlTrackingApi",
  baseQuery: fetchBaseQuery({ baseUrl: ulr.BASE_URL }),
  tagTypes: ["DHLTracking"],
  endpoints: (builder) => ({
    createDHLTracking: builder.mutation({
      query: (body) => ({
        url: "dhl-tracking/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["DHLTracking"],
    }),
    // Add more endpoints (get, update, delete) as needed
  }),
});

export const {
  useCreateDHLTrackingMutation,
} = dhlTrackingApi;
