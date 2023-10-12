import { createClient } from "@supabase/supabase-js";

// import { Database  } from "./database.types.ts"

export function getClient() {
  return createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY,
  );
}
