import { createClient } from "@supabase/supabase-js";

// import { Database  } from "./database.types.ts"

const client = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export function getClient() {
  return client;
}

export async function getDemo(id: number) {
  return client.from("demos").select("*").eq("id", id).limit(1).single();
}
