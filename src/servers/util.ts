import { MvdsvServer } from "@qwhub/pages/qtv/types.ts";

export function totalSpectatorCount(server: MvdsvServer) {
  return server.spectator_slots.used + server.qtv_stream.spectator_names.length;
}

export function qwleagueCountryCode(hostname = ""): string {
  const match = (hostname ?? "").match(/(?:^|\.)([a-z]{2})\.qwleague\.com/i);
  return match ? match[1].toLowerCase() : "";
}
