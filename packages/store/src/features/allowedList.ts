import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../storeConfig";

export interface IAllowedList {
    list: Array<string>;
}

const initialState: IAllowedList = {
    list: ["forgot-password", "reset-password"],
};

export const allowedListSlice = createSlice({
    name: "allwed-list",
    initialState,
    reducers: {
        addToAllowedList(state: IAllowedList, action: PayloadAction<string>) {
            state.list.push(action.payload);
        },
    },
});

export const { addToAllowedList } = allowedListSlice.actions;
export default allowedListSlice.reducer;
export const selectAllowedList = (state: RootState) => state.allowedList.list;
