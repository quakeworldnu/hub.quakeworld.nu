import { MvdsvServer } from "@qwhub/pages/qtv/types.ts";

export function totalSpectatorCount(server: MvdsvServer) {
  return server.spectator_slots.used + server.qtv_stream.spectator_names.length;
}
