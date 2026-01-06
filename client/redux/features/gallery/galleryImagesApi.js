import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const galleryApi = createApi({
    reducerPath: "galleryApi",

    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api/admin",
        credentials: "include",
    }),

    tagTypes: ["Gallery"],

    endpoints: (builder) => ({

        // ================= CREATE GALLERY IMAGE =================
        createGallery: builder.mutation({
            query: (data) => ({
                url: "/galleryInsert/insert",
                method: "POST",
                body: data, // FormData (image + category)
            }),
            invalidatesTags: ["Gallery"],
        }),

        // ================= GET ALL GALLERY IMAGES =================
        getAllGallery: builder.query({
            query: () => "/galleryDisplay/display",
            providesTags: ["Gallery"],
        }),

        // ================= VIEW SINGLE GALLERY IMAGE =================
        getGalleryById: builder.query({
            query: (id) => `/galleryView/view/${id}`,
            providesTags: ["Gallery"],
        }),

        // ================= UPDATE GALLERY IMAGE =================
        updateGallery: builder.mutation({
            query: ({ id, data }) => ({
                url: `/galleryUpdate/update/${id}`,
                method: "PUT",
                body: data, // FormData
            }),
            invalidatesTags: ["Gallery"],
        }),

        // ================= DELETE GALLERY IMAGE =================
        deleteGallery: builder.mutation({
            query: (id) => ({
                url: `/galleryDelete/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Gallery"],
        }),
    }),
});

export const {
    useCreateGalleryMutation,
    useGetAllGalleryQuery,
    useGetGalleryByIdQuery,
    useUpdateGalleryMutation,
    useDeleteGalleryMutation,
} = galleryApi;
