import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const principalApi = createApi({
    reducerPath: "principalApi",

    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api/admin",
        credentials: "include",
    }),

    tagTypes: ["Principal"],

    endpoints: (builder) => ({

        // 📥 GET ALL PRINCIPALS
        getAllPrincipals: builder.query({
            query: () => "/principal/view",
            providesTags: ["Principal"],
        }),

        // 👁️ GET SINGLE PRINCIPAL
        getSinglePrincipal: builder.query({
            query: (id) => `/principal/view/${id}`,
            providesTags: ["Principal"],
        }),

        // ➕ CREATE PRINCIPAL
        createPrincipal: builder.mutation({
            query: (formData) => ({
                url: "/principal/insert",
                method: "POST",
                body: formData, // ✅ FormData (image upload)
            }),
            invalidatesTags: ["Principal"],
        }),

        // ✏️ UPDATE PRINCIPAL
        updatePrincipal: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/principal/update/${id}`,
                method: "PUT",
                body: formData, // ✅ FormData
            }),
            invalidatesTags: ["Principal"],
        }),

        // ❌ DELETE PRINCIPAL
        deletePrincipal: builder.mutation({
            query: (id) => ({
                url: `/principal/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Principal"],
        }),

    }),
});

export const {
    useGetAllPrincipalsQuery,
    useGetSinglePrincipalQuery,
    useCreatePrincipalMutation,
    useUpdatePrincipalMutation,
    useDeletePrincipalMutation,
} = principalApi;
