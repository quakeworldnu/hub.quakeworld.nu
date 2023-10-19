import { useEffect, useState } from "react";
import { Demo } from "../services/supabase/supabase.types.ts";
import { searchDemos } from "../services/supabase/supabase.ts";
import { DemoBrowserSettings } from "./types.ts";
import { useLocalStorage } from "usehooks-ts";

export function useSearchDemos(settings: DemoBrowserSettings) {
  const [demos, setDemos] = useState<Demo[] | null>([]);

  useEffect(() => {
    async function run() {
      const { data } = await searchDemos(settings);
      setDemos(data as Demo[]);
    }

    run();
  }, [settings.query]);

  return { demos };
}

export function useDemoBrowserSettings() {
  const [settings, setSettings] = useLocalStorage<DemoBrowserSettings>(
    "demoBrowser",
    {
      displayMode: "list",
      query: "",
    },
  );

  return { settings, setSettings };
}
