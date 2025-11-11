import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import ulr from "@/config/urls";

const TNA_BASE = "tnas";
const tnaUrl = (path: string = "") => path ? `${TNA_BASE}/${path}` : TNA_BASE;

export const tnaApi = createApi({
  reducerPath: "tnaApi",
  baseQuery: fetchBaseQuery({ baseUrl: ulr.BASE_URL, credentials: "include" }),
  tagTypes: [ "TNA", "AuditLog", "Dashboard"],
  endpoints: (builder) => ({
    getTNAs: builder.query({
      query: (params) => ({ url: tnaUrl(), params }),
      providesTags: ["TNA"],
    }),
    createTNA: builder.mutation({
      query: (body) => ({ url: tnaUrl(), method: "POST", body }),
      invalidatesTags: ["TNA"],
    }),
    updateTNA: builder.mutation({
      query: ({ id, ...body }) => ({ url: tnaUrl(id), method: "PATCH", body }),
      invalidatesTags: ["TNA"],
    }),
    deleteTNA: builder.mutation({
      query: (id) => ({ url: tnaUrl(id), method: "DELETE" }),
      invalidatesTags: ["TNA"],
    }),
    getDepartmentProgress: builder.query({
      query: () => tnaUrl("department-progress"),
      providesTags: ["TNA"],
    }),
    getDepartmentProgressV2: builder.query({
      query: () => tnaUrl("department-progress-v2"),
      providesTags: ["TNA"],
    }),
    getTNASummary: builder.query({
      query: (params) => ({ url: tnaUrl("get-tna-summary"), params }),
      providesTags: ["Dashboard"],
    }),
    getTNASummaryCard: builder.query({
      query: () => tnaUrl("get-tna-summary-card"),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetTNAsQuery,
  useCreateTNAMutation,
  useUpdateTNAMutation,
  useDeleteTNAMutation,
  useGetDepartmentProgressQuery,
  useGetDepartmentProgressV2Query,
  useGetTNASummaryQuery,
  useGetTNASummaryCardQuery,
} = tnaApi;