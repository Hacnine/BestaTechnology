import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import ulr from "@/config/urls";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({ baseUrl: ulr.BASE_URL }),
  tagTypes: [ "Dashboard"],
  endpoints: (builder) => ({
 
    // Dashboard
    getDashboardStats: builder.query({
      query: () => "dashboard/stats",
      providesTags: ["Dashboard"],
    }),
    getRecentActivities: builder.query({
      query: () => "dashboard/recent-activities",
      providesTags: ["Dashboard"],
    }),
    getDashboardDepartmentProgress: builder.query({
      query: () => "dashboard/department-progress",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRecentActivitiesQuery,
  useGetDashboardDepartmentProgressQuery,
} = dashboardApi;
