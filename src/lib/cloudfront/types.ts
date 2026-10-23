export interface DemoInfo {
  version: string;
  sha256: string;
  filename: string;
  timestamp: string;
  mode: string;
  map: string;
  matchtag?: string;
  teams: Team[];
  players: Player[];
  pov?: PlayerPov;
  demo_duration: number;
  countdown_duration: number;
  match_duration: number;
  server: Server;
  source_filename: string;
  source_url?: string;
}

export interface Team {
  name: string;
  name_raw: string;
  color: number[];
  ping: number;
  frags: number;
}

export interface Server {
  hostname?: string;
  address?: string;
  ip?: string;
  port?: number;
  info: string;
}

export interface PlayerPov {
  id: string;
  number: string;
  name: string;
  name_raw: string;
  team: string;
  team_raw: string;
}

export interface Player {
  name: string;
  name_raw: string;
  team: string;
  team_raw: string;
  color: number[];
  ping: number;
  frags: number;
  auth_username?: string;
  auth_cc?: string;
  is_bot: boolean;
}
