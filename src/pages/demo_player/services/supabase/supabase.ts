import { createClient } from "@supabase/supabase-js";

import { Database } from "./database.types.ts";

import { DemoBrowserSettings } from "../../browser/types.ts";
import { Demo } from "./supabase.types.ts";

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

export async function searchDemosCount(settings: DemoBrowserSettings) {
  let qb = supabase.from("demos").select("count", { count: "exact" });
  const { query, gameMode } = settings;

  if (gameMode !== "all") {
    qb = qb.eq("mode", gameMode);
  }

  const fts = queryToFts(query);
  if (fts) {
    qb = qb.textSearch("fts", fts);
  }

  return qb.single();
}

export async function searchDemosRows(settings: DemoBrowserSettings) {
  let qb = supabase.from("demos").select("*");

  const { query, gameMode } = settings;

  if (gameMode !== "all") {
    qb = qb.eq("mode", gameMode);
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

export async function searchDemos(
  settings: DemoBrowserSettings,
): Promise<{ count: number; demos: Demo[] }> {
  const { data: count } = await searchDemosCount(settings);
  const { data: demos } = await searchDemosRows(settings);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return { count: count.count || 0, demos: demos || [] };
}
