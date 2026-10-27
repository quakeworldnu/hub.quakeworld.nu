export type FteAssets = { [key: string]: string };

export type FtePreloadModule = {
  canvas: HTMLCanvasElement;
  arguments: string[];
  manifest: string;
  files: object;
  setStatus: (value: string) => void;
  onFteReady: () => void; // called by the engine once initialized
  onHubRequest: (name: string) => void; // called by the engine (`hub_request <name>`)
};

// the engine api used by the hub (vikpe/fteqw fork)
export type FteModule = FtePreloadModule & {
  getClientState: () => ClientState;
  getCvar: (name: string) => string;
  command: (name: string, value?: string | number) => void;
  getParticipants: () => Participants;
  getAutotrackMode: () => string; // "user" (off), "high", "killer", "mod", "stats"
  getTrackedUserid: () => number; // -1 when not tracking
  isConsoleOpen: () => boolean;
  getKtxStats: () => string | null; // ktx stats json embedded in the demo
};

export type ClientState = {
  getPlayers: () => Player[]; // active players, engine slot order
  getDemoInfo: () => DemoInfo | null;
  getMatchElapsed: () => number | null; // ms, tracked from status/overtime prints
};

// all times in ms. null until the demo scan has finished, and when no demo file
// is playing (qtv, live)
export type DemoInfo = Readonly<{
  format: "mvd" | "qwd" | "nq" | "?";
  elapsed_ms: number; // seek target while seeking
  total_ms: number;
  timelimit_ms: number;
  countdown_ms: number; // 0 if no countdown was found
  overtime_ms: number;
  intermission_ms: number;
  pov_user_id: number;
  is_single_pov: boolean;
}>;

// engine player object, for userinfo changes (e.g. ctf skins)
export type Player = {
  userid: number;
  getTeamPlain: () => string;
  setUserInfo: (key: string, value: string) => void;
};

// Module.getParticipants(): the engine participant model (also used by its title and hud)
export type Participants = Readonly<{
  players: ParticipantPlayer[]; // no spectators, sorted by name_ascii
  teams: ParticipantTeam[]; // only with >2 players and exactly 2 teams, sorted by name_ascii
}>;

export type ParticipantPlayer = Readonly<{
  userid: number;
  frags: number;
  name: string;
  name_ascii: string;
  name_bytes: Uint8Array;
  team: string;
  team_ascii: string;
  team_bytes: Uint8Array;
  top_color: number; // palette slot 0..16
  bottom_color: number;
  top_rgb: string; // "#rrggbb"
  bottom_rgb: string;
  is_bot: boolean;
  is_tracked: boolean;
}>;

export type ParticipantTeam = Readonly<{
  name: string;
  name_ascii: string;
  name_bytes: Uint8Array;
  frags: number; // sum of the players
  top_color: number; // majority among the players
  bottom_color: number;
  top_rgb: string;
  bottom_rgb: string;
  player_count: number;
}>;

export enum Autotrack {
  ON = "stats",
  OFF = "user",
}

export enum ControlSource {
  USER = "user",
}

// dispatched as `fte.<command>` for every command sent to fte
export type FteCommandEvent = CustomEvent<{
  value?: string | number;
  source: ControlSource;
}>;

export interface FTEC {
  cbufadd: (command: string) => void;
}
