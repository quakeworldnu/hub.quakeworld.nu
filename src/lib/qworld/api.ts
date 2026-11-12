import { fetchGeo } from "./geo";
import { type KtxStatsEntry, toLastscores } from "./lastscores";
import { isGameServer, toServer } from "./server";
import { compareServers } from "./server-sort";
import type { GameServer, Server, TwitchStream } from "./types";

const API_URL = "https://api.quake.world/v1/";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new ApiError(response.status, `${response.status} ${path}`);
  }

  return response.json();
}

export async function fetchServer(address: string): Promise<Server> {
  const [gameServer, geo] = await Promise.all([
    get<GameServer>(`servers/${address}`),
    fetchGeo(),
  ]);

  if (!isGameServer(gameServer)) {
    throw new ApiError(404, "not a game server");
  }

  return toServer(gameServer, geo);
}

// all = every game server, active = with players, empty = without players
export type ServerListShow = "all" | "active" | "empty";

const serverListParams: Record<ServerListShow, string> = {
  all: "",
  active: "&min_players=1",
  empty: "&max_players=0",
};

export async function fetchServers(
  show: ServerListShow = "active",
): Promise<Server[]> {
  const [gameServers, geo] = await Promise.all([
    get<GameServer[]>(`servers?server_type=game${serverListParams[show]}`),
    fetchGeo(),
  ]);

  let servers: Server[] = gameServers.map((s) => toServer(s, geo));

  // ignored players (e.g. h1.nu) are removed in toServer
  if ("active" === show) {
    servers = servers.filter((s) => s.players.length > 0);
  }

  servers.sort(compareServers);
  return servers;
}

export async function fetchTwitchStreams(): Promise<TwitchStream[]> {
  const response = await get<{ data: TwitchStream[] }>("vendor/twitch-streams");
  const streams = response.data;
  streams.sort((a, b) => b.viewer_count - a.viewer_count);
  return streams;
}

export async function fetchLastscores(address: string) {
  const entries = await get<KtxStatsEntry[]>(`servers/${address}/lastscores`);
  return toLastscores(entries, address);
}
