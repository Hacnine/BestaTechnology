import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import ulr from "@/config/urls";

export const sampleDevelopmentApi = createApi({
  reducerPath: "sampleDevelopmentApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: ulr.BASE_URL,
    credentials: 'include',
  }),
  tagTypes: ["SampleDevelopment"],
  endpoints: (builder) => ({
    getSampleDevelopments: builder.query({
      query: (params) => ({ url: "sample-developments", params }),
      providesTags: ["SampleDevelopment"],
    }),
    createSampleDevelopment: builder.mutation({
      query: (body) => ({ url: "sample-developments", method: "POST", body }),
      invalidatesTags: ["SampleDevelopment"],
    }),
    updateSampleDevelopment: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `sample-developments/update/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["SampleDevelopment"],
    }),
    deleteSampleDevelopment: builder.mutation({
      query: (id) => ({
        url: `sample-developments/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SampleDevelopment"],
    }),
  }),
});

export const {
  useGetSampleDevelopmentsQuery,
  useCreateSampleDevelopmentMutation,
  useUpdateSampleDevelopmentMutation,
  useDeleteSampleDevelopmentMutation,
} = sampleDevelopmentApi;
