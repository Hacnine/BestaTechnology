import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import url from "@/config/urls";

export const costSheetApi = createApi({
  reducerPath: "costSheetApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${url.BASE_URL}/cost-sheets`,
    credentials: "include",
  }),

  tagTypes: ["CostSheet"],
  endpoints: (builder) => ({
    getCostSheets: builder.query<
      any,
      { page?: number; limit?: number; search?: string; scope?: string }
    >({
      query: ({ page = 1, limit = 10, search = "", scope } = {}) => {
        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("limit", String(limit));
        params.append("search", String(search || ""));
        params.append("orderBy", String(scope || "own"));
        if (scope !== undefined) params.append("scope", String(scope));
        return `/?${params.toString()}`;
      },
      providesTags: ["CostSheet"],
    }),
    getCostSheetById: builder.query<any, number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "CostSheet", id }],
    }),
    createCostSheet: builder.mutation<any, Partial<any>>({
      query: (body) => {
        // Check if body contains a File object (image)
        const hasFile = body.image instanceof File;
        
        if (hasFile) {
          // Use FormData for file uploads
          const formData = new FormData();
          Object.keys(body).forEach(key => {
            if (body[key] !== undefined && body[key] !== null) {
              if (key === 'image' && body[key] instanceof File) {
                formData.append('image', body[key]);
              } else {
                formData.append(key, typeof body[key] === 'object' ? JSON.stringify(body[key]) : String(body[key]));
              }
            }
          });
          
          return {
            url: "/",
            method: "POST",
            body: formData,
          };
        } else {
          // Use regular JSON for non-file requests
          return {
            url: "/",
            method: "POST",
            body,
          };
        }
      },
      invalidatesTags: ["CostSheet"],
    }),
    updateCostSheet: builder.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => {
        // Check if data contains a File object (image)
        const hasFile = data.image instanceof File;
        
        if (hasFile) {
          // Use FormData for file uploads
          const formData = new FormData();
          formData.append('data', JSON.stringify(data));
          formData.append('image', data.image);
          
          return {
            url: `/${id}`,
            method: "PUT",
            body: formData,
          };
        } else {
          // Use regular JSON for non-file requests
          return {
            url: `/${id}`,
            method: "PUT",
            body: data,
          };
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "CostSheet", id },
        "CostSheet",
      ],
    }),
    deleteCostSheet: builder.mutation<any, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CostSheet"],
    }),
    checkStyle: builder.query<
      { exists: boolean; creatorName?: string },
      string
    >({
      query: (style) => `/check-style?style=${style}`,
      keepUnusedDataFor: 0, // Disable cache for this query
    }),
  }),
});

export const {
  useGetCostSheetsQuery,
  useGetCostSheetByIdQuery,
  useCreateCostSheetMutation,
  useUpdateCostSheetMutation,
  useDeleteCostSheetMutation,
  useCheckStyleQuery,
} = costSheetApi;
