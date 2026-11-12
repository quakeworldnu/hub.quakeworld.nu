import { useLocalStorage } from "usehooks-ts";

export type ServerPresentation = "grid" | "list";

export function useServerPresentation() {
  const [value, setValue] = useLocalStorage<ServerPresentation>(
    "serversPresentation",
    "grid",
  );
  return [value === "list" ? "list" : "grid", setValue] as const;
}
