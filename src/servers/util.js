export function totalSpectatorCount(server) {
  return server.spectator_slots.used + server.qtv_stream.spectator_names.length;
}
