import type { Database } from "./database.types.ts";

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Game = Tables<"games">;
export type GameFields = keyof Game;

export type GamePlayer = {
  name: string;
  name_color: string;
  team: string;
  team_color: string;
  color: number[];
  frags: number;
  is_bot: boolean;
};

export type GameTeam = {
  name: string;
  name_color: string;
  color: number[];
  frags: number;
  ping: number;
  players: GamePlayer[];
};
