import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import ulr from "@/config/urls";

export const buyerApi = createApi({
  reducerPath: "buyerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${ulr.BASE_URL}/buyers`,
    credentials: "include",
  }),
  tagTypes: ["Buyer"],
  endpoints: (builder) => ({
    createBuyer: builder.mutation({
      query: (body) => ({
        url: "create-buyer",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Buyer"],
    }),
    getBuyers: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Buyer"],
    }),
    editBuyer: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Buyer"],
    }),
    deleteBuyer: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Buyer"],
    }),
  }),
});

export const {
  useCreateBuyerMutation,
  useGetBuyersQuery,
  useEditBuyerMutation,
  useDeleteBuyerMutation,
} = buyerApi;
