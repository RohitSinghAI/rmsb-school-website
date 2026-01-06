import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const sliderApi = createApi({
    reducerPath: "sliderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api/admin",
        credentials: "include",
    }),
    tagTypes: ["Slider"],
    endpoints: (builder) => ({

        // 📥 GET ALL SLIDERS
        getAllSlides: builder.query({
            query: () => "/slider",
            providesTags: ["Slider"],
        }),

        // ➕ CREATE SLIDER
        createSlide: builder.mutation({
            query: (formData) => ({
                url: "/slider/create",
                method: "POST",
                body: formData, // FormData (image upload)
            }),
            invalidatesTags: ["Slider"],
        }),

        // ✏️ UPDATE SLIDER
        updateSlide: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/slider/update/${id}`,
                method: "PUT",
                body: formData, // FormData
            }),
            invalidatesTags: ["Slider"],
        }),

        // ❌ DELETE SLIDER
        deleteSlide: builder.mutation({
            query: (id) => ({
                url: `/slider/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Slider"],
        }),

    }),
});

export const {
    useGetAllSlidesQuery,
    useCreateSlideMutation,
    useUpdateSlideMutation,
    useDeleteSlideMutation,
} = sliderApi;
