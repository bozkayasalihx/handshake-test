import { DataStruct } from "server/src/services/userVdsbsAccess";
import { IResponse } from "../config";
import baseApi from "./baseApi";

export const authorityApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAuthority: builder.mutation<
            IResponse<Record<string, DataStruct>>,
            { userId: number }
        >({
            query: ({ userId }) => ({
                url: "vdsbs/list-authority",
                method: "POST",
                data: {
                    userId,
                },
            }),
            
        }),
    }),

    overrideExisting: true,
});

export const { useGetAuthorityMutation } = authorityApi;
