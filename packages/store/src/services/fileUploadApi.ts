import { IResponse } from "../config";
import baseApi from "./baseApi";

type PSIDataType = {
    id: number;
    formData: FormData;
};

export const fileUploadApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        invoiceFileUpload: builder.mutation<IResponse<IId>, FormData>({
            query: (formData) => ({
                url: "file-upload/process-invoice-upload",
                method: "POST",
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }),
        }),

        pSIFileUplaod: builder.mutation<{ message: string }, PSIDataType>({
            query: ({ formData, id }) => ({
                url: "file-upload/process-ps-upload",
                method: "POST",
                data: formData,
                params: {
                    id,
                },
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useInvoiceFileUploadMutation, usePSIFileUplaodMutation } =
    fileUploadApi;
