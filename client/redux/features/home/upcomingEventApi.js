import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const upcomingEventApi = createApi({
    reducerPath: "upcomingEventApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api/admin",
        credentials: "include",
    }),
    tagTypes: ["UpcomingEvent"],
    endpoints: (builder) => ({

        // 📥 GET ALL EVENTS
        getAllUpcomingEvents: builder.query({
            query: () => "/upcomingEvent/all",
            providesTags: ["UpcomingEvent"],
        }),

        // ➕ CREATE EVENT
        createUpcomingEvent: builder.mutation({
            query: (data) => ({
                url: "/upcomingEvent/create",
                method: "POST",
                body: data, // JSON
            }),
            invalidatesTags: ["UpcomingEvent"],
        }),

        // ✏️ UPDATE EVENT
        updateUpcomingEvent: builder.mutation({
            query: ({ id, data }) => ({
                url: `/upcomingEvent/update/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["UpcomingEvent"],
        }),

        // ❌ DELETE EVENT
        deleteUpcomingEvent: builder.mutation({
            query: (id) => ({
                url: `/upcomingEvent/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["UpcomingEvent"],
        }),

    }),
});

export const {
    useGetAllUpcomingEventsQuery,
    useCreateUpcomingEventMutation,
    useUpdateUpcomingEventMutation,
    useDeleteUpcomingEventMutation,
} = upcomingEventApi;
