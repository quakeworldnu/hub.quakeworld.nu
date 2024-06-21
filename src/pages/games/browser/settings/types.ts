export type DisplayMode = "Grid" | "List";
export type GameMode = "All" | "1on1" | "2on2" | "4on4" | "Wipeout" | "CTF";

export type GameBrowserSettings = {
  displayMode: DisplayMode;
  gameMode: GameMode;
  map: string;
  playerQuery: string;
  teams: string;
  page: number;
};
