import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const hubSlice = createApi({
  reducerPath: "hub",
  baseQuery: fetchBaseQuery({ baseUrl: "https://hubapi.quakeworld.nu/v2/" }),
  endpoints: () => ({}),
});
