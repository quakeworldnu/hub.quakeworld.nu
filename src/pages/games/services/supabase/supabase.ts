import { PostgrestClient } from "@supabase/postgrest-js";
import type { GameMode } from "../../browser/settings/types.ts";
import type { Database } from "./database.types.ts";
import { Game } from "./supabase.types.ts";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// only the REST (PostgREST) part of supabase-js is used, skip auth/storage/realtime clients
// same url and auth headers as supabase-js createClient() with the anon key
const SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY: string = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = new PostgrestClient<Database>(
  new URL(
    "rest/v1",
    SUPABASE_URL.endsWith("/") ? SUPABASE_URL : `${SUPABASE_URL}/`,
  ).href,
  {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    schema: "public",
  },
);

// signal: cancels the request (e.g. when a query is superseded)
export async function getGame(
  id: number,
  signal?: AbortSignal,
): Promise<Game | null> {
  let qb = supabase.from("v1_games").select("*").eq("id", id).limit(1);

  if (signal) {
    qb = qb.abortSignal(signal);
  }

  const { data } = await qb.single();
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

export async function searchGamesCount(
  settings: {
    map: string;
    gameMode: GameMode;
    hostname: string;
    playerQuery: string;
    teams: string;
    matchtag: string;
    maxAge: number;
  },
  signal?: AbortSignal,
): Promise<number> {
  let qb = supabase
    .from("v1_games")
    .select("count", { head: true, count: "exact" });
  const { playerQuery, teams, map, gameMode, hostname, matchtag, maxAge } =
    settings;

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

  if (matchtag.length > 0) {
    qb = qb.ilike("matchtag", `%${matchtag}%`);
  }

  if (hostname.length > 0) {
    qb = qb.ilike("server_hostname", `%${hostname}%`);
  }

  if (maxAge > 0) {
    const minTimestamp = new Date(Date.now() - maxAge * MS_PER_DAY);
    qb = qb.gte("timestamp", minTimestamp.toISOString());
  }

  if (signal) {
    qb = qb.abortSignal(signal);
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
  | "server_hostname"
>;

export async function searchGamesRows(
  settings: {
    gameMode: GameMode;
    hostname: string;
    map: string;
    playerQuery: string;
    teams: string;
    matchtag: string;
    maxAge: number;
    page: number;
  },
  signal?: AbortSignal,
): Promise<GameSearchEntry[]> {
  let qb = supabase
    .from("v1_games")
    .select(
      "id,timestamp,mode,matchtag,map,teams,players,demo_sha256,server_hostname",
    );

  const { gameMode, hostname, map, playerQuery, teams, matchtag, maxAge } =
    settings;

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

  if (matchtag.length > 0) {
    qb = qb.ilike("matchtag", `%${matchtag}%`);
  }

  if (hostname.length > 0) {
    qb = qb.ilike("server_hostname", `%${hostname}%`);
  }

  if (maxAge > 0) {
    const minTimestamp = new Date(Date.now() - maxAge * MS_PER_DAY);
    qb = qb.gte("timestamp", minTimestamp.toISOString());
  }

  const limit = 15;
  const from = (settings.page - 1) * limit;
  const to = from + limit - 1;
  if (signal) {
    qb = qb.abortSignal(signal);
  }

  const { data } = await qb
    .order("timestamp", { ascending: false })
    .range(from, to);
  return data || [];
}
