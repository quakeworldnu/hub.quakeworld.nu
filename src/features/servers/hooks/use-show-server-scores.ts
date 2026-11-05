import { useLocalStorage } from "usehooks-ts";

export function useShowServerScores() {
  return useLocalStorage<boolean>("serversShowScores", true);
}
