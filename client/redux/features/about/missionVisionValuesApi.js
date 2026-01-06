import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const missionVisionValuesApi = createApi({
    reducerPath: "missionVisionValuesApi",

    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api/admin",
        credentials: "include",
    }),

    tagTypes: ["MissionVisionValues"],

    endpoints: (builder) => ({

        getAllMissionVisionValues: builder.query({
            query: () => "/missionVisionValues/view",
            providesTags: ["MissionVisionValues"],
        }),

        getSingleMissionVisionValues: builder.query({
            query: (id) => `/missionVisionValues/view/${id}`,
            providesTags: ["MissionVisionValues"],
        }),

        createMissionVisionValues: builder.mutation({
            query: (data) => ({
                url: "/missionVisionValues/insert",
                method: "POST",
                body: data, // JSON body
            }),
            invalidatesTags: ["MissionVisionValues"],
        }),

        updateMissionVisionValues: builder.mutation({
            query: ({ id, data }) => ({
                url: `/missionVisionValues/update/${id}`,
                method: "PUT",
                body: data, // JSON body
            }),
            invalidatesTags: ["MissionVisionValues"],
        }),

        deleteMissionVisionValues: builder.mutation({
            query: (id) => ({
                url: `/missionVisionValues/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["MissionVisionValues"],
        }),

    }),
});

export const {
    useGetAllMissionVisionValuesQuery,
    useGetSingleMissionVisionValuesQuery,
    useCreateMissionVisionValuesMutation,
    useUpdateMissionVisionValuesMutation,
    useDeleteMissionVisionValuesMutation,
} = missionVisionValuesApi;
