import { useLocalStorage } from "usehooks-ts";

// shared by the servers page and the demo browser
export function useShowScores() {
  return useLocalStorage<boolean>("demoBrowserShowScores", false);
}
