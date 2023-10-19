import { Database } from "./database.types.ts";
import { PostgrestError } from "@supabase/supabase-js";

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }>
  ? Exclude<U, null>
  : never;
export type DbResultErr = PostgrestError;

export type Demo = Tables<"demos">;

export type DemoPlayer = {
  name: string;
  team: string;
  top_color: number;
  bottom_color: number;
  frags: number;
  teamkills: number;
  deaths: number;
  suicides: number;
  ping: number;
};

export type DemoTeam = {
  name: string;
  frags: number;
  players: DemoPlayer[];
};

export type DemoParticipants = {
  teams: DemoTeam[];
  players: DemoPlayer[];
  player_count: number;
};
