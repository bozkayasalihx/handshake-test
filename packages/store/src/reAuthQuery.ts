import type { BaseQueryFn, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";
import { axiosBaseQuery, CustomFetchArgs } from "../axiosReAuthQuery";
import { logout, RootState } from "../storeConfig";
import { BASEURL } from "./config";

const mutex = new Mutex();
const baseQuery = axiosBaseQuery({
    baseURL: BASEURL,
});
//@ts-ignore
export const baseQueryWithReauth: BaseQueryFn<
    CustomFetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();
    const { getState } = api;
    const token = `Bearer ${(getState() as RootState).user.accessToken}`;
    args.header = { ...args.header, authorization: token };

    let result = await baseQuery(args, api, extraOptions);
    //@ts-ignore
    if (result?.error?.status === 401) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            try {
                const refreshResult = await baseQuery(
                    {
                        url: "refresh-token",
                        method: "GET",
                    },
                    api,
                    extraOptions
                );
                if (refreshResult.data) {
                    api.dispatch(
                        //@ts-ignore
                        tokenReceived(refreshResult.data.data.refreshToken)
                    );
                    result = await baseQuery(args, api, extraOptions);
                } else {
                    api.dispatch(logout());
                }
            } finally {
                release();
            }
        } else {
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }
    }
    return result;
};
