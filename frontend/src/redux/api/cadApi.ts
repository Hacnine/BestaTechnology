import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import ulr from "@/config/urls";

export const cadApi = createApi({
  reducerPath: "cadApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${ulr.BASE_URL}/cad`,
    credentials: "include",
  }),
  tagTypes: ["Cad", "SampleDevelopment", "FabricBooking"],
  endpoints: (builder) => ({
    createCadApproval: builder.mutation({
      query: (body) => ({ url: "cad-approval", method: "POST", body }),
      invalidatesTags: ["Cad"],
    }),
    getCadApproval: builder.query({
      query: (params) => ({ url: "cad-approval", method: "GET", params }),
      providesTags: ["Cad"],
    }),
    updateCadDesign: builder.mutation({
      query: ({ id, ...body }) => ({ url: `update-cad-design/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Cad"],
    }),
    createSampleDevelopment: builder.mutation({
      query: (body) => ({ url: "sample-development", method: "POST", body }),
      invalidatesTags: ["SampleDevelopment"],
    }),
    getSampleDevelopment: builder.query({
      query: (params) => ({ url: "get-sample-development", method: "GET", params }),
      providesTags: ["SampleDevelopment"],
    }),
  }),
});

export const {
  useCreateCadApprovalMutation,
  useGetCadApprovalQuery,
  useUpdateCadDesignMutation,
  useCreateSampleDevelopmentMutation,
  useGetSampleDevelopmentQuery,
} = cadApi;
