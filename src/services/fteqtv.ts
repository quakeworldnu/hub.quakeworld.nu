import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type SourcelistEntry = {
  server: string;
  host: string;
  players: number;
  viewers: number;
  id: number;
};

export const fteqtvApi = createApi({
  reducerPath: "fteqtv",
  baseQuery: fetchBaseQuery({ baseUrl: "https://fteqtv.quake.world/" }),
  endpoints: (build) => ({
    getSourcelist: build.query<SourcelistEntry[], null>({
      query: () => "sourcelist",
    }),
  }),
});

export const { useGetSourcelistQuery } = fteqtvApi;
