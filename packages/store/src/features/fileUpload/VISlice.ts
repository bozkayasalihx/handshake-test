import { createSlice } from "@reduxjs/toolkit";
import { fileUploadApi } from "../../services/fileUploadApi";

export interface InitialState {
    id: number;
}

const initialState: InitialState = {
    id: 0,
};

export const viSlice = createSlice({
    name: "viSlice",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            fileUploadApi.endpoints.invoiceFileUpload.matchFulfilled,
            (state, { payload }) => {
                state.id = payload.data.id;
            }
        );
    },
});

export default viSlice.reducer;
