import { createClient } from "@supabase/supabase-js";

import { Database } from "./database.types.ts";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export function getClient() {
  return supabase;
}

export async function getDemo(id: number) {
  return supabase.from("demos").select("*").eq("id", id).limit(1).single();
}
