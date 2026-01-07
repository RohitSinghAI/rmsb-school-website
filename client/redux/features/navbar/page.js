import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const navbarApi = createApi({
    reducerPath: "navbarApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api/admin",
        credentials: "include",
    }),
    tagTypes: ["Navbar"],
    endpoints: (builder) => ({

        getNavbar: builder.query({
            query: () => "/navbarDisplay/display",
        }),

        createNavbar: builder.mutation({
            query: (formData) => ({
                url: "/navbarCreate/create",
                method: "POST",
                body: formData,
            }),
        }),

        updateNavbar: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/navbarUpdate/update/${id}`,
                method: "PUT",
                body: formData,
            }),
        }),


    }),
});

export const {
    useGetNavbarQuery,
    useCreateNavbarMutation,
    useUpdateNavbarMutation,
} = navbarApi;
