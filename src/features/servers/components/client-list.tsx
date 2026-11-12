import { useMemo } from "react";
import { QuakeText, quakeStringToHtml } from "@/components/ui/quake-text";
import { isBot } from "@/lib/qworld/server";
import type { Bot, QuakeString, Server } from "@/lib/qworld/types";
import type { ServerPreviewState } from "./server-preview";

type ClientEntry = {
  name: QuakeString;
  status: "playing" | "spectating";
  server: Server;
};

const statusLabels: Record<ClientEntry["status"], string> = {
  playing: "Playing at",
  spectating: "Spectating",
};

// ignored: bots and hub clients (e.g. "hub.quakeworld.nu" spectator bots)
const isIgnoredClient = (client: { name: QuakeString; bot: Bot | null }) =>
  isBot(client) || client.name.ascii.trim().toLowerCase().startsWith("hub");

// players and spectators on the given servers, sorted by name
export function toClientEntries(servers: Server[]): ClientEntry[] {
  const entries: ClientEntry[] = [];

  for (const server of servers) {
    for (const player of server.players) {
      if (!isIgnoredClient(player)) {
        entries.push({ name: player.name, status: "playing", server });
      }
    }

    for (const spectator of server.spectators) {
      if (!isIgnoredClient(spectator)) {
        entries.push({ name: spectator.name, status: "spectating", server });
      }
    }
  }

  entries.sort((a, b) =>
    a.name.ascii.toLowerCase().localeCompare(b.name.ascii.toLowerCase()),
  );
  return entries;
}

// hovering a client shows the server they are on
export const ClientList = ({
  servers,
  preview,
}: {
  servers: Server[];
  preview: ServerPreviewState;
}) => {
  const clients = useMemo(() => toClientEntries(servers), [servers]);

  return (
    <div className="max-w-full text-sm">
      <div className="px-2 py-1.5 text-xs text-gray-400 border-b border-b-slate-700">
        Clients ({clients.length})
      </div>
      <div className="max-w-full overflow-x-auto" onScroll={preview.hide}>
        {clients.map(({ name, status, server }, index) => (
          <div
            key={`${server.address}-${status}-${name.unicode}-${index}`}
            className="flex items-center gap-3 h-10 px-2 border-b border-b-slate-800 odd:bg-white/3 hover:bg-white/8 whitespace-nowrap"
            onMouseEnter={(e) => preview.show(server.address, e)}
            onMouseLeave={preview.scheduleHide}
          >
            <QuakeText
              tag="span"
              text={quakeStringToHtml(name)}
              className="font-mono w-40 shrink-0 truncate"
            />
            <span
              className="text-xs text-gray-500 truncate"
              title={`${statusLabels[status]} ${server.meta.addressTitle}`}
            >
              {statusLabels[status]} {server.meta.addressTitle}
            </span>
          </div>
        ))}
        {0 === clients.length && (
          <div className="px-2 py-2 text-xs text-gray-500">No clients</div>
        )}
      </div>
    </div>
  );
};

if (import.meta.vitest) {
  const { expect, test } = import.meta.vitest;
  const client = (ascii: string, bot: Bot | null = null) => ({
    name: { ascii, unicode: ascii },
    bot,
  });

  test("toClientEntries", () => {
    const server = {
      players: [client("bps"), client("[bot]", { skill: 10 }), client("Anni")],
      spectators: [
        client("hub.quakeworld.nu"),
        client("HUB-bot"),
        client("Xan"),
      ],
    } as unknown as Server;

    expect(
      toClientEntries([server]).map((c) => [c.name.ascii, c.status]),
    ).toEqual([
      ["Anni", "playing"],
      ["bps", "playing"],
      ["Xan", "spectating"],
    ]);
  });
}
