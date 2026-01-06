import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const schoolHighlightApi = createApi({
    reducerPath: "schoolHighlightApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api/admin",
        credentials: "include",
    }),
    tagTypes: ["SchoolHighlight"],
    endpoints: (builder) => ({

        // 📥 GET ALL SCHOOL HIGHLIGHTS
        getAllSchoolHighlights: builder.query({
            query: () => "/schoolHighlight/all",
            providesTags: ["SchoolHighlight"],
        }),

        // ➕ CREATE SCHOOL HIGHLIGHT
        createSchoolHighlight: builder.mutation({
            query: (data) => ({
                url: "/schoolHighlight/create",
                method: "POST",
                body: data, // JSON (no image)
            }),
            invalidatesTags: ["SchoolHighlight"],
        }),

        // ✏️ UPDATE SCHOOL HIGHLIGHT
        updateSchoolHighlight: builder.mutation({
            query: ({ id, data }) => ({
                url: `/schoolHighlight/update/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["SchoolHighlight"],
        }),

        // ❌ DELETE SCHOOL HIGHLIGHT
        deleteSchoolHighlight: builder.mutation({
            query: (id) => ({
                url: `/schoolHighlight/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["SchoolHighlight"],
        }),

    }),
});

export const {
    useGetAllSchoolHighlightsQuery,
    useCreateSchoolHighlightMutation,
    useUpdateSchoolHighlightMutation,
    useDeleteSchoolHighlightMutation,
} = schoolHighlightApi;
