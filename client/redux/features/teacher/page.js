import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const facultyApi = createApi({
    reducerPath: "facultyApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api/admin",
        credentials: "include",
    }),
    tagTypes: ["Faculty"],
    endpoints: (builder) => ({

        // 📥 GET ALL FACULTY
        getAllFaculty: builder.query({
            query: () => "/faculty/all",
            providesTags: ["Faculty"],
        }),

        // ➕ CREATE FACULTY
        createFaculty: builder.mutation({
            query: (formData) => ({
                url: "/faculty/create",
                method: "POST",
                body: formData, // FormData (image upload)
            }),
            invalidatesTags: ["Faculty"],
        }),

        // ✏️ UPDATE FACULTY
        updateFaculty: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/faculty/update/${id}`,
                method: "PUT",
                body: formData, // FormData
            }),
            invalidatesTags: ["Faculty"],
        }),

        // ❌ DELETE FACULTY
        deleteFaculty: builder.mutation({
            query: (id) => ({
                url: `/faculty/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Faculty"],
        }),

    }),
});

export const {
    useGetAllFacultyQuery,
    useCreateFacultyMutation,
    useUpdateFacultyMutation,
    useDeleteFacultyMutation,
} = facultyApi;
