import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const facilityApi = createApi({
    reducerPath: "facilityApi",

    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api/admin",
        credentials: "include",
    }),

    tagTypes: ["Facility"],

    endpoints: (builder) => ({

        // 📥 GET ALL FACILITIES 
        getAllFacilities: builder.query({
            query: () => "/facility/view",
            transformResponse: (response) => response.data,
            providesTags: ["Facility"],
        }),

        // 👁️ GET SINGLE FACILITY
        getSingleFacility: builder.query({
            query: (id) => `/facility/view/${id}`,
            providesTags: ["Facility"],
        }),

        // ➕ CREATE FACILITY (image required)
        createFacility: builder.mutation({
            query: (formData) => ({
                url: "/facility/insert",
                method: "POST",
                body: formData, // FormData (title, content, image)
            }),
            invalidatesTags: ["Facility"],
        }),

        // ✏️ UPDATE FACILITY (flexible)
        updateFacility: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/facility/update/${id}`,
                method: "PUT",
                body: formData, // FormData (any of: title, content, image)
            }),
            invalidatesTags: ["Facility"],
        }),

        // ❌ DELETE FACILITY
        deleteFacility: builder.mutation({
            query: (id) => ({
                url: `/facility/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Facility"],
        }),

    }),
});

export const {
    useGetAllFacilitiesQuery,
    useGetSingleFacilityQuery,
    useCreateFacilityMutation,
    useUpdateFacilityMutation,
    useDeleteFacilityMutation,
} = facilityApi;
