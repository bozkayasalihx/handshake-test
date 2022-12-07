import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../storeConfig";

export interface SpinnerInitialState {
    isLoading: boolean;
}

const initialState: SpinnerInitialState = {
    isLoading: false,
};

export const spinnerSlice = createSlice({
    name: "spinner",
    initialState,
    reducers: {
        setIsLoading(
            state: SpinnerInitialState,
            action: PayloadAction<SpinnerInitialState>
        ) {
            state.isLoading = action.payload.isLoading;
        },
    },
});

export const { setIsLoading } = spinnerSlice.actions;
export default spinnerSlice.reducer;
export const selectSpinner = (state: RootState) => state.spinner.isLoading;
