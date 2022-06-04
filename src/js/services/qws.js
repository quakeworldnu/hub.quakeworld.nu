import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const paramsToString = (params) =>
  params ? `?${new URLSearchParams(params).toString()}` : "";

// Define a service using a base URL and expected endpoints
export const qwsApi = createApi({
  reducerPath: "qwsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://metaqtv.quake.se/v2/" }),
  endpoints: (builder) => ({
    getMvdsv: builder.query({
      query: (params) => "mvdsv" + paramsToString(params),
    }),
    getStreams: builder.query({
      query: (params) => "streams" + paramsToString(params),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetMvdsvQuery, useGetStreamsQuery } = qwsApi;
