import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import url from "@/config/urls";

export const merchandiserApi = createApi({
  reducerPath: "merchandiserApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${url.BASE_URL}/merchandiser/`,
    credentials: "include",
  }),
  tagTypes: ["Merchandiser", "Buyer", "Department", "Tna"],
  endpoints: (builder) => ({
    createBuyer: builder.mutation({
      query: (body) => ({
        url: "create-buyer",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Buyer", "Merchandiser"],
    }),
    createDepartment: builder.mutation({
      query: (body) => ({
        url: "create-department",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Department", "Merchandiser"],
    }),
    getMerchandisers: builder.query({
      query: () => ({
        url: "merchandisers",
        method: "GET",
      }),
      providesTags: ["Merchandiser"],
    }),
    getDepartments: builder.query({
      query: () => ({
        url: "departments",
        method: "GET",
      }),
      providesTags: ["Department"],
    }),
  }),
});

export const {
  useCreateBuyerMutation,
  useCreateDepartmentMutation,
  useGetMerchandisersQuery,
  useGetDepartmentsQuery,
} = merchandiserApi;