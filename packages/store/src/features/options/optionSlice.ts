import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../storeConfig";

export interface InitialState {
    option: string;
}

const initialState: InitialState = {
    option: "",
};

export const optionSlice = createSlice({
    name: "optionSlice",
    initialState,
    reducers: {
        storeOption(state: InitialState, action: PayloadAction<InitialState>) {
            state.option = action.payload.option;
        },
    },
});

export const { storeOption } = optionSlice.actions;
export default optionSlice.reducer;
export const selectOption = (state: RootState) => state.selectedOption.option;
