import { MvdsvServer } from "@qwhub/pages/qtv/types.ts";

export function totalSpectatorCount(server: MvdsvServer) {
  return server.spectator_slots.used + server.qtv_stream.spectator_names.length;
}

export function qwleagueCountryCode(hostname = ""): string {
  const match = (hostname ?? "").match(/(?:^|\.)([a-z]{2})\.qwleague\.com/i);
  return match ? match[1].toLowerCase() : "";
}

export function isQwleagueHostname(hostname: string | null = ""): boolean {
  return (hostname ?? "").includes(".qwleague.com");
}

export function isQwleagueOfficial(
  hostname: string | null = "",
  matchtag: string | null = "",
): boolean {
  return (
    isQwleagueHostname(hostname) &&
    (matchtag ?? "").toLowerCase().includes("official")
  );
}
