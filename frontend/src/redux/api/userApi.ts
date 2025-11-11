import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../slices/userSlice";
import url from "@/config/urls";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: async (args, api, extraOptions) => {
    const rawBaseQuery = fetchBaseQuery({
      baseUrl: `${url.BASE_URL}/user/`,
      credentials: "include",
    });
    const result = await rawBaseQuery(args, api, extraOptions);
    // If token expired or unauthorized, force logout to clear persisted user
    if (result.error && (result.error.status === 401 || result.error.status === 403)) {
      try {
        api.dispatch(logout());
      } catch (e) {
        // ignore
      }
    }
    return result;
  },
  tagTypes: ["User", "Get User", "AuditLog", "Dashboard"],
  endpoints: (builder) => ({
    // Users
    login: builder.mutation({
      query: ({ body }) => ({ url: `login/`, method: "POST", body }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: `logout/`, method: "POST" }),
      invalidatesTags: ["User"],
    }),
    userInfo: builder.query({
      // Fetch server-side user info to validate auth token
      query: () => ({ url: `user-info/`, method: "GET" }),
      providesTags: ["User"],
    }),
    getUsers: builder.query({
      query: (params) => ({ url: "users/", params }),
      providesTags: ["Get User"],
    }),
    getUserStats: builder.query({
      query: () => "/stats",
      providesTags: ["Get User"],
    }),
    createUser: builder.mutation({
      query: (body) => ({ url: "create-user", method: "POST", body }),
      invalidatesTags: ["Get User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({ url: `update/${id}`, method: "PUT", body }),
      invalidatesTags: ["Get User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `delete/${id}`, method: "DELETE" }),
      invalidatesTags: ["Get User"],
    }),
    toggleUserStatus: builder.mutation({
      query: (id) => ({ url: `users/${id}/toggle-status`, method: "PATCH" }),
      invalidatesTags: ["Get User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useUserInfoQuery,
  useGetUsersQuery,
  useGetUserStatsQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
} = userApi;
