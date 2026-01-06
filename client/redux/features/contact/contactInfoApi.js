import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contactInfoApi = createApi({
    reducerPath: "contactInfoApi",

    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api/admin",
        credentials: "include",
    }),

    tagTypes: ["ContactInfo"],

    endpoints: (builder) => ({

        getAllContactInfo: builder.query({
            query: () => "/contactInfo/view",
            providesTags: ["ContactInfo"],
        }),

        getSingleContactInfo: builder.query({
            query: (id) => `/contactInfo/view/${id}`,
            providesTags: ["ContactInfo"],
        }),

        createContactInfo: builder.mutation({
            query: (data) => ({
                url: "/contactInfo/insert",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ContactInfo"],
        }),

        updateContactInfo: builder.mutation({
            query: ({ id, data }) => ({
                url: `/contactInfo/update/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["ContactInfo"],
        }),

        deleteContactInfo: builder.mutation({
            query: (id) => ({
                url: `/contactInfo/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ContactInfo"],
        }),

    }),
});

export const {
    useGetAllContactInfoQuery,
    useGetSingleContactInfoQuery,
    useCreateContactInfoMutation,
    useUpdateContactInfoMutation,
    useDeleteContactInfoMutation,
} = contactInfoApi;
