import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types.ts";

import type { GameMode } from "../../browser/settings/types.ts";
import { Game } from "./supabase.types.ts";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export async function getGame(id: number): Promise<Game | null> {
  const { data } = await supabase
    .from("games")
    .select("*")
    .eq("id", id)
    .limit(1)
    .single();
  return data || null;
}

function queryToFts(query = ""): string {
  const q = query.replace(/\s+/g, " ").trim();

  if (!q) {
    return "";
  }

  return q
    .split(" ")
    .map((p) => `'${p}'`)
    .join(" & ");
}

export async function searchGamesCount(settings: {
  map: string;
  gameMode: GameMode;
  playerQuery: string;
  teams: string;
}): Promise<number> {
  let qb = supabase
    .from("games")
    .select("count", { head: true, count: "estimated" });
  const { playerQuery, teams, map, gameMode } = settings;

  if (gameMode !== "All") {
    qb = qb.eq("mode", gameMode.toLowerCase());
  }

  if (map.length > 0) {
    qb = qb.eq("map", map.toLowerCase());
  }

  if (teams.length > 0) {
    qb = qb.contains("team_names", teams.toLowerCase().split(" "));
  }

  const players_fts = queryToFts(playerQuery);
  if (players_fts) {
    qb = qb.textSearch("players_fts", players_fts);
  }

  const result = await qb.single();
  return result?.count ?? 0;
}

export type GameSearchEntry = Pick<
  Game,
  | "id"
  | "timestamp"
  | "mode"
  | "matchtag"
  | "map"
  | "teams"
  | "players"
  | "demo_sha256"
>;

export async function searchGamesRows(settings: {
  gameMode: GameMode;
  map: string;
  playerQuery: string;
  teams: string;
  page: number;
}): Promise<GameSearchEntry[]> {
  let qb = supabase
    .from("games")
    .select("id,timestamp,mode,matchtag,map,teams,players,demo_sha256");

  const { gameMode, map, playerQuery, teams } = settings;

  if (gameMode !== "All") {
    qb = qb.eq("mode", gameMode.toLowerCase());
  }

  if (map.length > 0) {
    qb = qb.eq("map", map);
  }

  if (teams.length > 0) {
    qb = qb.contains("team_names", teams.toLowerCase().split(" "));
  }

  const fts = queryToFts(playerQuery);
  if (fts) {
    qb = qb.textSearch("players_fts", fts);
  }

  const limit = 15;
  const from = (settings.page - 1) * limit;
  const to = from + limit - 1;
  const { data } = await qb
    .order("timestamp", { ascending: false })
    .range(from, to);
  return data || [];
}
