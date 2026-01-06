import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const testimonialsApi = createApi({
    reducerPath: "testimonialsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api/admin",
        credentials: "include",
    }),
    tagTypes: ["Testimonials"],

    endpoints: (builder) => ({

        // ✅ GET ALL TESTIMONIALS
        getAllTestimonials: builder.query({
            query: () => "/testimonials/display",
            providesTags: ["Testimonials"],
        }),

        // ✅ GET SINGLE TESTIMONIAL
        getTestimonialById: builder.query({
            query: (id) => `/testimonials/view/${id}`,
        }),

        // ✅ CREATE TESTIMONIAL
        createTestimonial: builder.mutation({
            query: (formData) => ({
                url: "/testimonials/insert",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Testimonials"],
        }),

        // ✅ UPDATE TESTIMONIAL (ACCEPT)
        updateTestimonial: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/testimonials/update/${id}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["Testimonials"],
        }),

        // ✅ DELETE TESTIMONIAL
        deleteTestimonial: builder.mutation({
            query: (id) => ({
                url: `/testimonials/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Testimonials"],
        }),
    }),
});

export const {
    useGetAllTestimonialsQuery,
    useGetTestimonialByIdQuery,
    useCreateTestimonialMutation,
    useUpdateTestimonialMutation,
    useDeleteTestimonialMutation,
} = testimonialsApi;
