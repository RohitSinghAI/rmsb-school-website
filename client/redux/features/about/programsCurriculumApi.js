import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const programsCurriculumApi = createApi({
    reducerPath: "programsCurriculumApi",

    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api/admin",
        credentials: "include",
    }),

    tagTypes: ["ProgramsCurriculum"],

    endpoints: (builder) => ({

        getAllProgramsCurriculum: builder.query({
            query: () => "/programsCurriculum/view",
            providesTags: ["ProgramsCurriculum"],
        }),

        getSingleProgramsCurriculum: builder.query({
            query: (id) => `/programsCurriculum/view/${id}`,
            providesTags: ["ProgramsCurriculum"],
        }),

        getProgramsCurriculumByType: builder.query({
            query: (type) => `/programsCurriculum/view/type/${type}`,
            providesTags: ["ProgramsCurriculum"],
        }),

        createProgramsCurriculum: builder.mutation({
            query: (data) => ({
                url: "/programsCurriculum/insert",
                method: "POST",
                body: data, // JSON body
            }),
            invalidatesTags: ["ProgramsCurriculum"],
        }),

        updateProgramsCurriculum: builder.mutation({
            query: ({ id, data }) => ({
                url: `/programsCurriculum/update/${id}`,
                method: "PUT",
                body: data, // JSON body
            }),
            invalidatesTags: ["ProgramsCurriculum"],
        }),

        deleteProgramsCurriculum: builder.mutation({
            query: (id) => ({
                url: `/programsCurriculum/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ProgramsCurriculum"],
        }),

    }),
});

export const {
    useGetAllProgramsCurriculumQuery,
    useGetSingleProgramsCurriculumQuery,
    useGetProgramsCurriculumByTypeQuery,
    useCreateProgramsCurriculumMutation,
    useUpdateProgramsCurriculumMutation,
    useDeleteProgramsCurriculumMutation,
} = programsCurriculumApi;
