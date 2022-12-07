import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASEURL, IResponse } from "../config";

export interface LoginRequest {
    email: string;
    password: string;
}

export type UserDataType = {
    username: string;
    user_type: string;
    user_id: number;
    accessToken: string;
};

export const authApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: BASEURL }),
    endpoints: (builder) => ({
        login: builder.mutation<IResponse<UserDataType>, LoginRequest>({
            query: (credentials) => ({
                url: "login",
                method: "POST",
                body: credentials,
            }),
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: "logout",
                method: "POST",
            }),
        }),
    }),

});``

export const { useLoginMutation, useLogoutMutation } = authApi;
