import {
  faBars,
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import React, {
  type MouseEvent,
  type RefObject,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useEventListener,
  useLocalStorage,
  useOnClickOutside,
} from "usehooks-ts";
import { useCopyToClipboard } from "@/components/server/copy-address-button";
import { FontAwesomeIcon } from "@/components/ui/icon";
import { PingIndicator } from "@/components/ui/ping-indicator";
import { QuakeText, quakeStringToHtml } from "@/components/ui/quake-text";
import { useShowServerPing } from "@/features/servers/hooks/use-show-server-ping";
import { isBot } from "@/lib/qworld/server";
import {
  qwleagueCountryCode,
  statusText,
  totalSpectatorCount,
} from "@/lib/qworld/server-utils";
import { getStunPing, useStunPings } from "@/lib/qworld/stun-ping";
import type { Server } from "@/lib/qworld/types";
import { getFlagUrl } from "@/utils/flags";
import type { ServerPreviewState } from "./server-preview";

type SortKey =
  | "map"
  | "hostname"
  | "mode"
  | "status"
  | "playerNames"
  | "players"
  | "spectators"
  | "ping";
type SortDirection = "asc" | "desc";
type Sort = { key: SortKey; direction: SortDirection } | null;

type Column = {
  key: SortKey;
  label: string;
  className: string;
  defaultDirection: SortDirection; // on first click
  value: (s: Server) => string | number;
};

// share of player slots taken (x/y), more players first on equal coverage
export const playerCoverage = (s: Server): number =>
  (s.player_limit > 0 ? s.players.length / s.player_limit : 0) +
  s.players.length / 1_000_000;

const columns: Column[] = [
  {
    key: "hostname",
    label: "Hostname",
    className: "w-[35%]",
    defaultDirection: "asc",
    value: (s) => s.meta.addressTitle.toLowerCase(),
  },
  {
    key: "map",
    label: "Map",
    className: "w-20",
    defaultDirection: "asc",
    value: (s) => s.info.map ?? "",
  },
  {
    key: "mode",
    label: "Mode",
    className: "hidden sm:table-cell w-20",
    defaultDirection: "asc",
    value: (s) => s.meta.mode,
  },
  {
    key: "status",
    label: "Status",
    className: "hidden md:table-cell",
    defaultDirection: "asc",
    value: (s) => statusText(s).toLowerCase(),
  },
  {
    key: "playerNames",
    label: "Players",
    className: "hidden lg:table-cell w-[30%]",
    defaultDirection: "asc",
    value: (s) =>
      s.players
        .filter((p) => !isBot(p))
        .map((p) => p.name.ascii.toLowerCase())
        .sort()
        .join(","),
  },
  {
    key: "players",
    label: "Players",
    className: "text-right w-20",
    defaultDirection: "desc",
    value: playerCoverage,
  },
  {
    key: "spectators",
    label: "Specs",
    className: "text-right w-20",
    defaultDirection: "desc",
    value: totalSpectatorCount,
  },
  {
    key: "ping",
    label: "Ping (ms)",
    className: "hidden md:table-cell text-right w-20",
    defaultDirection: "asc",
    value: (s) => {
      const ping = pingValue(getStunPing(s.ip));
      return typeof ping === "number" ? ping : "";
    },
  },
];

// rtt in ms, null = no reply, "pending" = measuring, undefined = not supported
type Ping = number | null | "pending" | undefined;

const pingValue = (result: ReturnType<typeof getStunPing>): Ping => {
  if (!result) {
    return undefined;
  }
  return "pending" === result.status ? "pending" : result.rtt;
};

// empty values (e.g. no players) last regardless of direction, ties keep the original order
export function sortServers(servers: Server[], sort: Sort): Server[] {
  const column = columns.find((c) => c.key === sort?.key);

  if (!sort || !column) {
    return servers;
  }

  const factor = "asc" === sort.direction ? 1 : -1;
  const entries = servers.map((server, index) => ({
    server,
    index,
    value: column.value(server),
  }));

  entries.sort((a, b) => {
    const aEmpty = "" === a.value;
    const bEmpty = "" === b.value;

    if (aEmpty !== bEmpty) {
      return aEmpty ? 1 : -1;
    }

    const diff =
      typeof a.value === "number" && typeof b.value === "number"
        ? a.value - b.value
        : `${a.value}`.localeCompare(`${b.value}`);

    return diff * factor || a.index - b.index;
  });

  return entries.map((e) => e.server);
}

// first click: column default direction, second: reversed, third: original order
function nextSort(sort: Sort, column: Column): Sort {
  if (sort?.key !== column.key) {
    return { key: column.key, direction: column.defaultDirection };
  }

  if (sort.direction === column.defaultDirection) {
    return {
      key: column.key,
      direction: "asc" === sort.direction ? "desc" : "asc",
    };
  }

  return null;
}

const defaultSort: Sort = { key: "players", direction: "desc" };

// condensed server list (table), alternative to the grid of server cards
export const ServerList = ({
  servers,
  preview,
}: {
  servers: Server[];
  preview: ServerPreviewState;
}) => {
  const [sort, setSort] = useLocalStorage<Sort>("serversListSort", defaultSort);
  // ping column is opt-in (additional filters), a stored sort by ping is
  // kept but not applied while hidden
  const [showPing] = useShowServerPing();
  const visibleColumns = showPing
    ? columns
    : columns.filter((c) => "ping" !== c.key);
  const activeSort = !showPing && "ping" === sort?.key ? defaultSort : sort;
  // pings arrive in the background, re-sort when they do
  const pingVersion = useStunPings(servers, showPing);
  const sortedServers = useMemo(
    () => sortServers(servers, activeSort),
    [servers, activeSort, pingVersion],
  );

  return (
    <table className="w-full text-sm">
      <thead className="text-xs text-gray-400 text-left">
        <tr className="border-b border-b-slate-700">
          {visibleColumns.map((column) => (
            <SortableHeader
              key={column.key}
              column={column}
              direction={
                activeSort?.key === column.key ? activeSort.direction : null
              }
              onClick={() => setSort(nextSort(activeSort, column))}
            />
          ))}
          <th className="w-12" />
        </tr>
      </thead>
      <tbody>
        {sortedServers.map((server) => (
          <ServerRow
            key={server.address}
            server={server}
            ping={showPing ? pingValue(getStunPing(server.ip)) : undefined}
            showPing={showPing}
            onPreview={preview.show}
            onLeave={preview.scheduleHide}
            onHidePreview={preview.hide}
          />
        ))}
      </tbody>
    </table>
  );
};

const SortableHeader = ({
  column,
  direction,
  onClick,
}: {
  column: Column;
  direction: SortDirection | null;
  onClick: () => void;
}) => {
  const icon =
    null === direction ? faSort : "asc" === direction ? faSortUp : faSortDown;

  return (
    <th
      className={`px-2 py-1.5 font-normal ${column.className}`}
      aria-sort={
        null === direction
          ? "none"
          : "asc" === direction
            ? "ascending"
            : "descending"
      }
    >
      <button
        type="button"
        onClick={onClick}
        title={`Sort by ${column.label.toLowerCase()}`}
        className={clsx(
          "inline-flex items-center gap-1 cursor-pointer select-none hover:text-white whitespace-nowrap",
          { "text-white font-bold": null !== direction },
        )}
      >
        {column.label}
        <FontAwesomeIcon
          icon={icon}
          size="xs"
          className={clsx({ "opacity-30": null === direction })}
        />
      </button>
    </th>
  );
};

// memo: unchanged servers keep their object identity between polls
type ServerRowProps = {
  server: Server;
  ping: Ping;
  showPing: boolean;
  onPreview: (address: string, e: MouseEvent<HTMLElement>) => void;
  onLeave: () => void;
  onHidePreview: () => void;
};

const ServerRow = React.memo((props: ServerRowProps) => {
  const { server, ping, showPing, onPreview, onLeave, onHidePreview } = props;
  const map = server.info.map ?? "";
  const cc = qwleagueCountryCode(server.info.hostname) || server.meta.geo.cc;
  const playerCount = server.players.length;
  const isFull = playerCount >= server.player_limit;

  return (
    <tr
      className="group h-10 border-b border-b-slate-800 odd:bg-white/3 hover:bg-white/8"
      onMouseEnter={(e) => onPreview(server.address, e)}
      onMouseLeave={onLeave}
    >
      <td className="px-2 py-1 max-w-0">
        <HostnameButton server={server} cc={cc} />
      </td>
      <td className="px-2 py-1 whitespace-nowrap text-gray-300">{map}</td>
      <td className="px-2 py-1 hidden sm:table-cell whitespace-nowrap text-gray-300">
        {server.meta.mode}
      </td>
      <td
        className="px-2 py-1 hidden md:table-cell whitespace-nowrap text-xs text-gray-300"
        title={statusText(server)}
      >
        {"Unknown" === server.meta.status.name
          ? server.meta.status.description
          : server.meta.status.name}
      </td>
      <td className="px-2 py-1 hidden lg:table-cell max-w-0">
        <PlayerNames server={server} />
      </td>
      <td
        className={clsx("px-2 py-1 text-right whitespace-nowrap tabular-nums", {
          "text-gray-500": 0 === playerCount,
          "bg-sky-900/40": playerCount > 0,
          "text-sky-100": playerCount > 0 && !isFull,
          "font-bold text-white": isFull,
        })}
      >
        {playerCount} / {server.player_limit}
      </td>
      <td
        className={clsx("px-2 py-1 text-right tabular-nums", {
          "text-gray-500": 0 === totalSpectatorCount(server),
        })}
      >
        {totalSpectatorCount(server)}
      </td>
      {showPing && (
        <td
          className="px-2 py-1 hidden md:table-cell text-right whitespace-nowrap text-xs"
          title={
            undefined === ping
              ? "Ping not available for this server"
              : "Round trip time from your browser (STUN)"
          }
        >
          {typeof ping === "number" && <PingIndicator ms={ping} />}
          {"pending" === ping && <span className="text-gray-500">…</span>}
          {(null === ping || undefined === ping) && (
            <span className="text-gray-600">–</span>
          )}
        </td>
      )}
      {/* no preview while using the menu (it would cover the dropdown) */}
      <td className="px-2 py-1 text-right" onMouseEnter={onHidePreview}>
        <ActionMenu server={server} />
      </td>
    </tr>
  );
});

// copies hostname:port (or ip:port) to the clipboard
const HostnameButton = ({ server, cc }: { server: Server; cc: string }) => {
  const [isCopied, copy] = useCopyToClipboard();

  return (
    <button
      type="button"
      onClick={() => copy(server.meta.hostport)}
      title={`Copy ${server.meta.hostport} to clipboard`}
      className="flex items-center max-w-[min(100%,360px)] text-left cursor-pointer hover:text-white"
    >
      {cc && (
        <img
          src={getFlagUrl(cc)}
          alt={cc}
          className="inline h-3 w-auto mr-2 shrink-0"
        />
      )}
      <span
        className="truncate whitespace-nowrap"
        title={server.meta.addressTitle}
      >
        {server.meta.addressTitle}
      </span>
      {isCopied ? (
        <span className="ml-1.5 text-xs text-green-400 shrink-0">Copied</span>
      ) : (
        <img
          src="https://hub.quakeworld.nu/assets/img/icons/content_paste.svg"
          width="12"
          alt=""
          className="app-icon ml-1.5 shrink-0"
        />
      )}
    </button>
  );
};

// human players comma separated (highest frags first), bots as a count
const PlayerNames = ({ server }: { server: Server }) => {
  const humans = server.players
    .filter((p) => !isBot(p))
    .sort((a, b) => b.frags - a.frags);
  const botCount = server.players.length - humans.length;

  if (0 === server.players.length) {
    return null;
  }

  const botText = `${botCount} ${1 === botCount ? "bot" : "bots"}`;

  if (0 === humans.length) {
    return <div className="text-xs text-gray-500">{botText}</div>;
  }

  const html = humans.map((p) => quakeStringToHtml(p.name)).join(", ");
  const names = humans.map((p) => p.name.ascii).join(", ");
  const title = botCount > 0 ? `${names} + ${botText}` : names;

  return (
    <div
      title={title}
      className="flex items-center max-w-[min(100%,320px)] text-xs"
    >
      <QuakeText
        text={html}
        className="truncate whitespace-nowrap min-w-0 text-gray-300"
      />
      {botCount > 0 && (
        <span className="ml-1 shrink-0 whitespace-nowrap text-gray-500">
          + {botText}
        </span>
      )}
    </div>
  );
};

const ActionMenu = ({ server }: { server: Server }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref as RefObject<HTMLDivElement>, () => setIsOpen(false));
  useEventListener("keydown", (e) => "Escape" === e.key && setIsOpen(false));

  const actions = [
    { label: "Join", href: `qw://${server.meta.connectAddress}/` },
    {
      label: "Spectate",
      href: `qw://${server.meta.connectAddress}/observe`,
    },
    ...(server.qtv_stream
      ? [
          { label: "QTV", href: `qw://${server.qtv_stream.url}/qtvplay` },
          { label: "Web QTV", href: `/qtv/?address=${server.address}` },
        ]
      : []),
  ];

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        title="Actions"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "p-1.5 rounded text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer",
          "group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100",
          { "opacity-0": !isOpen, "bg-white/10": isOpen },
        )}
      >
        <FontAwesomeIcon fixedWidth icon={faBars} />
      </button>
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1 z-20 min-w-32 py-1 rounded border border-slate-700 bg-slate-900 shadow-lg text-left"
        >
          {actions.map((action) => (
            <a
              key={action.label}
              role="menuitem"
              href={action.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 whitespace-nowrap"
            >
              {action.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

if (import.meta.vitest) {
  const { expect, test } = import.meta.vitest;
  const server = (hostname: string, ip: string, playerCount: number) =>
    ({
      ip,
      port: 28501,
      player_limit: 4,
      info: { map: "dm2" },
      meta: { addressTitle: hostname, mode: "1on1" },
      players: Array.from({ length: playerCount }, () => ({
        name: { ascii: "p" },
      })),
      spectators: [],
      qtv_stream: null,
    }) as unknown as Server;

  const a = server("bravo", "192.168.0.1", 2);
  const b = server("alpha", "10.0.0.2", 0);
  const c = server("charlie", "9.0.0.1", 2);
  const servers = [a, b, c];

  test("sortServers", () => {
    expect(sortServers(servers, null)).toEqual(servers);
    const hostname = (sort: Sort) =>
      sortServers(servers, sort).map((s) => s.meta.addressTitle);
    expect(hostname({ key: "hostname", direction: "asc" })).toEqual([
      "alpha",
      "bravo",
      "charlie",
    ]);
    // ties keep the original order
    expect(hostname({ key: "players", direction: "desc" })).toEqual([
      "bravo",
      "charlie",
      "alpha",
    ]);
    // player coverage: 2/2 before 2/4
    const full = { ...server("delta", "1.1.1.1", 2), player_limit: 2 };
    expect(
      sortServers([a, full], { key: "players", direction: "desc" }).map(
        (s) => s.meta.addressTitle,
      ),
    ).toEqual(["delta", "bravo"]);
    // empty player list last in both directions
    expect(hostname({ key: "playerNames", direction: "desc" })[2]).toBe(
      "alpha",
    );
  });
}
