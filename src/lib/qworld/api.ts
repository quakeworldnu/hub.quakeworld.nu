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

export async function fetchServers(): Promise<Server[]> {
  const [gameServers, geo] = await Promise.all([
    get<GameServer[]>("servers?server_type=game&min_clients=1"),
    fetchGeo(),
  ]);

  const servers: Server[] = gameServers
    .map((s) => toServer(s, geo))
    .filter((s: Server) => s.players.length + s.spectators.length > 0);
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
