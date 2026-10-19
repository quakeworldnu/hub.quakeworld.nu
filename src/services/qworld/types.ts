// api.quake.world/v1

export type QuakeString = {
  ascii: string;
  unicode: string;
};

export type Bot = {
  skill: number;
};

export type Player = {
  name: QuakeString;
  team: QuakeString;
  frags: number;
  top_color: number;
  bottom_color: number;
  user_id: number;
  ping: number;
  time: number;
  bot: Bot | null;
  auth: string | null;
};

export type Spectator = {
  name: QuakeString;
  ping: number;
  time: number;
  bot: Bot | null;
  auth: string | null;
};

export type Team = {
  name: QuakeString;
  frags: number;
  top_color: number;
  bottom_color: number;
  ping: number;
};

export type QtvStream = {
  id: number;
  name: QuakeString;
  number: number;
  address: string;
  url: string;
  client_names: QuakeString[];
};

export type GameServer = {
  server_type: "game";
  software_type: string;
  address: string;
  ip: string;
  port: number;
  player_mode: string | null;
  game_mod: string | null;
  info: Record<string, string>;
  player_limit: number;
  spectator_limit: number | null;
  total_spectator_count: number;
  score: number;
  teams: Team[];
  players: Player[];
  spectators: Spectator[];
  qtv_stream: QtvStream | null;
};

// api.quake.world/v1/vendor/twitch-streams (twitch helix streams)
export type TwitchStream = {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
};

// hub
export type Geo = {
  cc: string;
  country: string;
  region: string;
  city: string;
  coordinates: [number, number];
};

export type ServerStatus = {
  name: "Standby" | "Started" | "Unknown";
  description: string;
};

export type ServerMeta = {
  mode: string;
  title: string;
  status: ServerStatus;
  time: { total: number; elapsed: number; remaining: number };
  geo: Geo;
  hostport: string;
  addressTitle: string;
  spectatorText: string;
  matchtag: string;
  playerDisplay: { visible: number; hidden: number };
  wrapperClassNames: string;
  supportsLastscores: boolean;
};

export type Server = GameServer & { meta: ServerMeta };
