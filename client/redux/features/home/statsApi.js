import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const statsApi = createApi({
    reducerPath: "statsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api/admin",
        credentials: "include",
    }),
    tagTypes: ["Stats"],
    endpoints: (builder) => ({

        // 📥 GET ALL STATS
        getAllStats: builder.query({
            query: () => "/stats/all",
            providesTags: ["Stats"],
        }),

        // ➕ CREATE STAT
        createStat: builder.mutation({
            query: (data) => ({
                url: "/stats/create",
                method: "POST",
                body: data, // JSON
            }),
            invalidatesTags: ["Stats"],
        }),

        // ✏️ UPDATE STAT
        updateStat: builder.mutation({
            query: ({ id, data }) => ({
                url: `/stats/update/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Stats"],
        }),

        // ❌ DELETE STAT
        deleteStat: builder.mutation({
            query: (id) => ({
                url: `/stats/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Stats"],
        }),

    }),
});

export const {
    useGetAllStatsQuery,
    useCreateStatMutation,
    useUpdateStatMutation,
    useDeleteStatMutation,
} = statsApi;
