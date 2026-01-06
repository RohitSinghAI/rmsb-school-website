import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contactApi = createApi({
    reducerPath: "contactApi",

    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api/admin",
        credentials: "include",
    }),

    tagTypes: ["Contact"],

    endpoints: (builder) => ({
        // ================= CREATE CONTACT =================
        createContact: builder.mutation({
            query: (data) => ({
                url: "/contact/creat",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Contact"],
        }),

        // ================= GET ALL CONTACTS =================
        getAllContact: builder.query({
            query: () => "/contact/view",
            providesTags: ["Contact"],
        }),

        // ================= DELETE CONTACT =================
        deleteContact: builder.mutation({
            query: (id) => ({
                url: `/contact/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Contact"],
        }),
    }),
});

export const {
    useCreateContactMutation,
    useGetAllContactQuery,
    useDeleteContactMutation,
} = contactApi;
