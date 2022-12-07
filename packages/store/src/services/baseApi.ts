import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "../reAuthQuery";

const baseApi = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
    
});

export default baseApi;
