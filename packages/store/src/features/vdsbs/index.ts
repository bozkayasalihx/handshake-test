import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DataStruct } from "server/src/services/userVdsbsAccess";
import { RootState } from "../../../storeConfig";

export interface Vdsbs {
    data: Record<string, DataStruct>;
}

const initialState: Vdsbs = {
    data: {},
};

export const vdsbsSlice = createSlice({
    name: "vdsbs",
    initialState,
    reducers: {
        setVdsbs(state: Vdsbs, action: PayloadAction<Vdsbs>) {
            state.data = action.payload.data;
        },
    },
});

export const { setVdsbs } = vdsbsSlice.actions;
export default vdsbsSlice.reducer;
export const selectVdsbs = (state: RootState) => state.vdsbs.data;
