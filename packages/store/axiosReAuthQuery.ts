import type { BaseQueryFn } from "@reduxjs/toolkit/query";

import axios from "axios";

import type { AxiosError, AxiosRequestConfig } from "axios";

type BaseQueryType = {
    baseURL: string;
};

export type CustomFetchArgs = {
    url: string;
    method: AxiosRequestConfig["method"];
    data?: AxiosRequestConfig["data"];
    params?: AxiosRequestConfig["params"];
    header?: AxiosRequestConfig["headers"];
};

type Result = {
    data?: any;
    error?: {
        status?: number;
        data: any;
    };
};

export const axiosBaseQuery = ({
    baseURL,
}: BaseQueryType): BaseQueryFn<CustomFetchArgs, Result, unknown> => {
    return async ({ url, method, data, params, header }) => {
        const isContainsSlash = url[0] === "/";
        let newURL = "";
        if (isContainsSlash) {
            newURL = baseURL;
        } else {
            newURL = baseURL + "/" + url;
        }

        try {
            const result = await axios({
                url: newURL,
                method,
                data,
                params,
                headers: header,
                withCredentials: true,
            });
            return {
                data: result.data,
            };
        } catch (axiosError) {
            //NOTE: when error accured which step can move on;
            let error = axiosError as AxiosError;
            return {
                error: {
                    status: error.response?.status,
                    data: error.response?.data || error.message,
                },
            };
        }
    };
};
