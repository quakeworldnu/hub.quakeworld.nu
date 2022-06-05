import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const qwsSlice = createApi({
  reducerPath: "qws",
  baseQuery: fetchBaseQuery({ baseUrl: "https://metaqtv.quake.se/v2/" }),
  endpoints: () => ({}),
});
