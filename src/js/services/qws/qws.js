import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const qwsSlice = createApi({
  reducerPath: "qws",
  baseQuery: fetchBaseQuery({ baseUrl: "https://hubapi.quakeworld.nu/v2/" }),
  endpoints: () => ({}),
});
