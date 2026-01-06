import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const journeyTimelineApi = createApi({
    reducerPath: "journeyTimelineApi",

    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api/admin",
        credentials: "include",
    }),

    tagTypes: ["JourneyTimeline"],

    endpoints: (builder) => ({

        getAllJourneyTimeline: builder.query({
            query: () => "/journeyTimeline/view",
            providesTags: ["JourneyTimeline"],
        }),

        getSingleJourneyTimeline: builder.query({
            query: (id) => `/journeyTimeline/view/${id}`,
            providesTags: ["JourneyTimeline"],
        }),

        createJourneyTimeline: builder.mutation({
            query: (data) => ({
                url: "/journeyTimeline/insert",
                method: "POST",
                body: data, // JSON body
            }),
            invalidatesTags: ["JourneyTimeline"],
        }),

        updateJourneyTimeline: builder.mutation({
            query: ({ id, data }) => ({
                url: `/journeyTimeline/update/${id}`,
                method: "PUT",
                body: data, // JSON body
            }),
            invalidatesTags: ["JourneyTimeline"],
        }),

        deleteJourneyTimeline: builder.mutation({
            query: (id) => ({
                url: `/journeyTimeline/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["JourneyTimeline"],
        }),

    }),
});

export const {
    useGetAllJourneyTimelineQuery,
    useGetSingleJourneyTimelineQuery,
    useCreateJourneyTimelineMutation,
    useUpdateJourneyTimelineMutation,
    useDeleteJourneyTimelineMutation,
} = journeyTimelineApi;
