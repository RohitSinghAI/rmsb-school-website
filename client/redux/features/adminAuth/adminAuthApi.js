import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminAuthApi = createApi({
  reducerPath: "adminAuthApi",
  tagTypes: ["AdminAuth"],
  keepUnusedDataFor: 60,

  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/admin/`,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),

  endpoints: (builder) => ({

    loginAdmin: builder.mutation({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["AdminAuth"],
    }),

    registerAdmin: builder.mutation({
      query: (data) => ({
        url: "register",
        method: "POST",
        body: data,
      }),
    }),

    getAdminProfile: builder.query({
      query: () => ({
        url: "profile",
        method: "GET",
      }),
      providesTags: ["AdminAuth"],
    }),

    updateAdminProfile: builder.mutation({
      query: (data) => ({
        url: "profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AdminAuth"],
    }),

    logoutAdmin: builder.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
      invalidatesTags: ["AdminAuth"],
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "change-password",
        method: "POST",
        body: data,
      }),
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "reset-password",
        method: "POST",
        body: data,
      }),
    }),

  }),
});

export const {
  useLoginAdminMutation,
  useRegisterAdminMutation,
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useLogoutAdminMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = adminAuthApi;
