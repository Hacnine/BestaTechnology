import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import url from "@/config/urls";

export const trimsAndAccessoriesApi = createApi({
  reducerPath: "trimsAndAccessoriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${url.BASE_URL}/trims-and-accessories`,
    credentials: "include",
  }),
  tagTypes: ["TrimsAndAccessories"],
  endpoints: (builder) => ({
    getTrimsAndAccessories: builder.query<any, { page?: number; limit?: number; search?: string }>(
      {
        query: ({ page = 1, limit = 10, search = "" } = {}) =>
          `/?page=${page}&limit=${limit}&search=${search}`,
        providesTags: ["TrimsAndAccessories"],
      }
    ),
    getTrimsAndAccessoriesById: builder.query<any, number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "TrimsAndAccessories", id }],
    }),
    createTrimsAndAccessories: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TrimsAndAccessories"],
    }),
    updateTrimsAndAccessories: builder.mutation<any, { id: number; data: any }>(
      {
        query: ({ id, data }) => ({
          url: `/update/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: "TrimsAndAccessories", id },
          "TrimsAndAccessories",
        ],
      }
    ),
  }),
});

export const {
  useGetTrimsAndAccessoriesQuery,
  useGetTrimsAndAccessoriesByIdQuery,
  useCreateTrimsAndAccessoriesMutation,
  useUpdateTrimsAndAccessoriesMutation,
} = trimsAndAccessoriesApi;
