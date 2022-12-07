import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authApi, UserDataType } from "../../services/authApi";

const initialState: UserDataType = {
    username: "",
    user_type: "",
    user_id: 0,
    accessToken: "",
};

export const authSlice = createSlice({
    name: "loginSlice",
    initialState: initialState,
    reducers: {
        logout: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                authApi.endpoints.login.matchFulfilled,
                (state, { payload }) => {
                    state.accessToken = payload.data.accessToken;
                    state.user_id = payload.data.user_id;
                    state.user_type = payload.data.user_type;
                    state.username = payload.data.username;
                }
            )
            .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
                state.accessToken = "";
                state.user_id = 0;
                state.user_type = "";
                state.username = "";
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
