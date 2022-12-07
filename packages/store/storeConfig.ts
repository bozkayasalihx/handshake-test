import { configureStore } from "@reduxjs/toolkit";
import { __prod__ } from "config";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
    FLUSH,
    PAUSE,
    PERSIST,
    persistCombineReducers,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage/session";
import thunk from "redux-thunk";
import allowedListReducer from "./src/features/allowedList";
import viSliceReducer from "./src/features/fileUpload/VISlice";
import optionSlice from "./src/features/options/optionSlice";
import spinnerReducer from "./src/features/spinner/spinnerSlice";
import userReducer from "./src/features/user/authSlice";
import vdsbsReducer from "./src/features/vdsbs";
import { authApi } from "./src/services/authApi";

const persistConfig = {
    key: "root",
    version: 1,
    storage: storage,
};

const persistedReducer = persistCombineReducers(persistConfig, {
    user: userReducer,
    selectedOption: optionSlice,
    viUpload: viSliceReducer,
    spinner: spinnerReducer,
    allowedList: allowedListReducer,
    vdsbs: vdsbsReducer,
    [authApi.reducerPath]: authApi.reducer,
});
const store = configureStore({
    reducer: persistedReducer,
    devTools: !__prod__,
    middleware: (getDefaultMiddleware) => {
        const midware = getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        });

        return [...midware, authApi.middleware, thunk];
    },
});

export type OnlyArgs<T> = {
    [P in keyof T as T[P] extends Function ? never : P]: T[P];
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const persistor = persistStore(store);
export default store;

// features
export * from "./src/features/allowedList";
export * from "./src/features/options/optionSlice";
export * from "./src/features/spinner/spinnerSlice";
export * from "./src/features/user/authSlice";
export * from "./src/select/fileIdSelect";
export * from "./src/select/OptionSelect";
export * from "./src/select/tokenSelect";
// selector
export * from "./src/select/userSelect";
// services
export * from "./src/services/authApi";
export * from "./src/services/baseApi";
export * from "./src/services/fileUploadApi";

export enum QS {
    uninitialized = "uninitialized",
    pending = "pending",
    fulfilled = "fulfilled",
    rejected = "rejected",
}
