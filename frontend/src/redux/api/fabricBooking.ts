import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import ulr from "@/config/urls";

export const fabricBookingApi = createApi({
  reducerPath: "fabricBookingApi",
  baseQuery: fetchBaseQuery({ baseUrl: ulr.BASE_URL, credentials: "include" }),
  tagTypes: ["FabricBooking"],
  endpoints: (builder) => ({
    getFabricBookings: builder.query({
      query: (params) => ({ url: "fabric-booking", params }),
      providesTags: ["FabricBooking"],
    }),
    createFabricBooking: builder.mutation({
      query: (body) => ({ url: "fabric-booking", method: "POST", body }),
      invalidatesTags: ["FabricBooking"],
    }),
    updateFabricBooking: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `fabric-booking/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["FabricBooking"],
    }),
    deleteFabricBooking: builder.mutation({
      query: (id) => ({
        url: `fabric-booking/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FabricBooking"],
    }),
  }),
});

export const {
  useGetFabricBookingsQuery,
  useCreateFabricBookingMutation,
  useUpdateFabricBookingMutation,
  useDeleteFabricBookingMutation,
} = fabricBookingApi;
