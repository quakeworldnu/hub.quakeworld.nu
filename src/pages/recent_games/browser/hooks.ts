import { DemoBrowserSettings } from "./types.ts";
import { useLocalStorage } from "usehooks-ts";

export function useDemoBrowserSettings() {
  const [settings, setSettings] = useLocalStorage<DemoBrowserSettings>(
    "demoBrowser",
    {
      displayMode: "grid",
      gameMode: "all",
      query: "",
      page: 1,
    },
  );

  function setPage(page: number) {
    setSettings({ ...settings, page });
  }

  return { settings, setSettings, setPage };
}
