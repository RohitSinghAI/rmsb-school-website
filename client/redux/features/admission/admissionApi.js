import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const admissionApi = createApi({
    reducerPath: "admissionApi",

    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api/admin",
        credentials: "include",
    }),

    tagTypes: ["Admission"],

    endpoints: (builder) => ({

        /* ================= CREATE ADMISSION ================= */
        createAdmission: builder.mutation({
            query: (data) => ({
                url: "/createAdmission/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "Admission", id: "LIST" }],
        }),

        /* ================= GET ALL ADMISSIONS ================= */
        getAllAdmissions: builder.query({
            query: () => "/getAllAdmissions/display",
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map((item) => ({
                            type: "Admission",
                            id: item._id,
                        })),
                        { type: "Admission", id: "LIST" },
                    ]
                    : [{ type: "Admission", id: "LIST" }],
        }),

        /* ================= GET SINGLE ADMISSION ================= */
        getAdmissionById: builder.query({
            query: (id) => `/getAdmissionById/view/${id}`,
            providesTags: (result, error, id) => [
                { type: "Admission", id },
            ],
        }),

        /* ================= UPDATE FULL ADMISSION (STATUS + ALL FIELDS) ================= */
        updateAdmission: builder.mutation({
            query: ({ id, data }) => ({
                url: `/updateAdmission/update/${id}`,
                method: "PUT",
                body: data, // 🔥 status + other fields
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Admission", id },
                { type: "Admission", id: "LIST" },
            ],
        }),

        /* ================= UPDATE DOCUMENTS ================= */
        updateAdmissionDocuments: builder.mutation({
            query: ({ id, data }) => ({
                url: `/updateAdmissionDocuments/update/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Admission", id },
                { type: "Admission", id: "LIST" },
            ],
        }),

        /* ================= DELETE SINGLE DOCUMENT ================= */
        deleteAdmissionDocument: builder.mutation({
            query: ({ id, field }) => ({
                url: `/deleteAdmissionDocument/delete/${id}/${field}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Admission", id },
                { type: "Admission", id: "LIST" },
            ],
        }),

        /* ================= DELETE ADMISSION ================= */
        deleteAdmission: builder.mutation({
            query: (id) => ({
                url: `/deleteAdmission/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Admission", id: "LIST" }],
        }),
        /* ================= APPROVE / REJECT (EMAIL TRIGGER) ================= */
        updateAdmissionStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/updateAdmissionStatus/status/${id}`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Admission", id },
                { type: "Admission", id: "LIST" },
            ],
        }),

        /* ================= PROMOTE ADMISSION ================= */
        promoteAdmission: builder.mutation({
            query: ({ id, nextClass }) => ({
                url: "/promoteAdmission/promote",
                method: "POST",
                body: {
                    id,
                    nextClass,
                },
            }),
            invalidatesTags: [{ type: "Admission", id: "LIST" }],
        }),

    }),
});

export const {
    useCreateAdmissionMutation,
    useGetAllAdmissionsQuery,
    useGetAdmissionByIdQuery,
    useUpdateAdmissionMutation,
    useUpdateAdmissionStatusMutation,
    useUpdateAdmissionDocumentsMutation,
    useDeleteAdmissionDocumentMutation,
    useDeleteAdmissionMutation,
    usePromoteAdmissionMutation,
} = admissionApi;
