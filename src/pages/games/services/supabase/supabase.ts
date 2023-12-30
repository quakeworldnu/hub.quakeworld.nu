import { createClient } from "@supabase/supabase-js";

import { Database } from "./database.types.ts";

import { GameMode } from "../../browser/settings/types.ts";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export async function getDemo(id: number) {
  return supabase.from("demos").select("*").eq("id", id).limit(1).single();
}

function queryToFts(query: string = ""): string {
  const q = query.replace(/\s+/g, " ").trim();

  if (!q) {
    return "";
  }

  return q
    .split(" ")
    .map((p) => `'${p}'`)
    .join(" & ");
}

export async function searchDemosCount(settings: {
  query: string;
  gameMode: GameMode;
}): Promise<number> {
  let qb = supabase.from("demos").select("count", { count: "exact" });
  const { query, gameMode } = settings;

  if (gameMode !== "All") {
    qb = qb.eq("mode", gameMode.toLowerCase());
  }

  const fts = queryToFts(query);
  if (fts) {
    qb = qb.textSearch("fts", fts);
  }

  const result = await qb.single();
  return result?.count ?? 0;
}

export async function searchDemosRows(settings: {
  query: string;
  gameMode: GameMode;
  page: number;
}) {
  let qb = supabase.from("demos").select("*");

  const { query, gameMode } = settings;

  if (gameMode !== "All") {
    qb = qb.eq("mode", gameMode.toLowerCase());
  }

  const fts = queryToFts(query);
  if (fts) {
    qb = qb.textSearch("fts", fts);
  }

  const limit = 20;
  const from = (settings.page - 1) * limit;
  const to = from + limit - 1;
  return qb.order("timestamp", { ascending: false }).range(from, to);
}
