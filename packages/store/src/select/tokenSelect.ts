import { RootState } from "../../storeConfig";
export const tokenSelect = (state: RootState) => state.user.accessToken;
