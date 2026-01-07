import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const aboutUsApi = createApi({
    reducerPath: "aboutUsApi",

    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api/admin",
        credentials: "include",
    }), 

    tagTypes: ["AboutUs"],

    endpoints: (builder) => ({

        getAllAboutUs: builder.query({
            query: () => "/aboutUs/view",
            providesTags: ["AboutUs"],
        }),

        getSingleAboutUs: builder.query({
            query: (id) => `/aboutUs/view/${id}`,
            providesTags: ["AboutUs"],
        }),

        createAboutUs: builder.mutation({
            query: (formData) => ({
                url: "/aboutUs/insert",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["AboutUs"],
        }),

        updateAboutUs: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/aboutUs/update/${id}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["AboutUs"],
        }),

        deleteAboutUs: builder.mutation({
            query: (id) => ({
                url: `/aboutUs/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["AboutUs"],
        }),

    }),
});

export const {
    useGetAllAboutUsQuery,
    useGetSingleAboutUsQuery,
    useCreateAboutUsMutation,
    useUpdateAboutUsMutation,
    useDeleteAboutUsMutation,
} = aboutUsApi;
