import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import ulr from "@/config/urls";

export const auditApi = createApi({
  reducerPath: "auditApi",
  baseQuery: fetchBaseQuery({ baseUrl: ulr.BASE_URL }),
  tagTypes: ["AuditLog"],
  endpoints: (builder) => ({
   

    // Audit Logs
    getAuditLogs: builder.query({
      query: (params) => ({ url: "audit-logs", params }),
      providesTags: ["AuditLog"],
    }),
    createAuditLog: builder.mutation({
      query: (body) => ({ url: "audit-logs", method: "POST", body }),
      invalidatesTags: ["AuditLog"],
    }),
    exportAuditLogs: builder.query({
      query: () => "audit-logs/export",
      providesTags: ["AuditLog"],
    }),

  }),
});

export const {
  useGetAuditLogsQuery,
  useCreateAuditLogMutation,
  useExportAuditLogsQuery
} = auditApi;
