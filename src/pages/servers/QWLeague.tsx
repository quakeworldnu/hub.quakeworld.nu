import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@qwhub/FontAwesomeIcon";
import type { QueueStats } from "@qwhub/services/qwleague/queue";
import clsx from "clsx";

const QWLEAGUE_URL = "https://qwleague.com";

// same labels as the mode picker on qwleague.com, in display order
const MODE_LABELS: Record<string, string> = {
  aim: "Aim",
  "1on1": "1on1",
  "2on2": "2on2",
  "4on4": "4on4",
  "4on4x": "4on4 x",
  "2on2at": "2on2 team",
  "4on4at": "4on4 team",
};

const MODE_ORDER = Object.keys(MODE_LABELS);

// known modes in display order, unknown modes last
function sortedModes(stats: QueueStats) {
  const rank = (mode: string) => {
    const i = MODE_ORDER.indexOf(mode);
    return i === -1 ? MODE_ORDER.length : i;
  };
  return Object.entries(stats.by_mode).sort(([a], [b]) => rank(a) - rank(b));
}

export function QWLeague({ stats }: { stats: QueueStats | null }) {
  return (
    <div className="w-full sm:w-96 self-start 3xl:self-stretch border border-orange-900/60 rounded-md p-3 bg-orange-950/40">
      <div className="flex items-center">
        <img
          src="/assets/img/qwleague_logo.svg"
          alt="QWLeague"
          className="h-7 w-auto"
        />
        <h2 className="ml-1.5 text-lg font-bold text-[#ff3b1f]">QWLeague</h2>
      </div>
      <div className="mt-2 text-sm text-gray-200">
        Elo matchmaking, map veto, dedicated servers.
      </div>

      {stats && <Queue stats={stats} />}

      <a
        href={QWLEAGUE_URL}
        target="_top"
        className="mt-4 flex items-center justify-center p-2 text-sm text-white rounded shadow-md border bg-linear-to-b from-orange-900/40 to-orange-900/30 border-orange-800/30 transition-colors hover:from-orange-800/50 hover:to-orange-900/60 hover:border-orange-600"
      >
        Play at qwleague.com
        <FontAwesomeIcon icon={faChevronRight} className="ml-1.5 text-xs" />
      </a>
    </div>
  );
}

function Queue({ stats }: { stats: QueueStats }) {
  if (!stats.matchmaking_enabled) {
    return (
      <div className="mt-3 text-sm text-orange-100/60">
        Matchmaking is currently paused.
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="mb-1.5 text-sm text-orange-200">
        <WaitingCount count={stats.waiting} /> in queue
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {sortedModes(stats).map(([mode, count]) => (
          <ModeCard
            key={mode}
            mode={mode}
            label={MODE_LABELS[mode] ?? mode}
            count={count}
            slots={MODE_SLOTS[mode] ?? 2}
            continents={sortedContinents(stats, mode)}
          />
        ))}
      </div>
    </div>
  );
}

const WAITING_THRESHOLD = 5;

function WaitingCount({ count }: { count: number }) {
  if (count > 0 && count < WAITING_THRESHOLD) {
    return (
      <>
        less than <strong>{WAITING_THRESHOLD}</strong> players
      </>
    );
  }

  return (
    <>
      <strong>{count}</strong> players
    </>
  );
}

// players needed to start one match
const MODE_SLOTS: Record<string, number> = {
  "1on1": 2,
  aim: 2,
  "2on2": 4,
  "4on4": 8,
  "4on4x": 8,
  "2on2at": 4,
  "4on4at": 8,
};

// continents with most queued players first
function sortedContinents(stats: QueueStats, mode: string) {
  return Object.entries(stats.by_mode_continent[mode] ?? {}).sort(
    ([a, x], [b, y]) => y - x || a.localeCompare(b),
  );
}

function ModeCard({
  mode,
  label,
  count,
  slots,
  continents,
}: {
  mode: string;
  label: string;
  count: number;
  slots: number;
  continents: [string, number][];
}) {
  const isActive = count > 0;

  return (
    <a
      href={`${QWLEAGUE_URL}/play?mode=${encodeURIComponent(mode)}`}
      target="_top"
      title={`Play ${label} (${count} in queue)`}
      className={clsx(
        "group flex flex-col justify-center rounded border px-2.5 py-1.5 transition-colors",
        {
          "border-orange-700/60 bg-orange-900/30 hover:border-orange-600 hover:bg-orange-900/50":
            isActive,
          "hidden sm:flex border-white/5 bg-black/20 hover:border-orange-600 hover:bg-orange-900/50":
            !isActive,
        },
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={clsx("text-sm font-semibold truncate", {
            "text-orange-300": isActive,
            "text-orange-100/40 group-hover:text-orange-300": !isActive,
          })}
        >
          {label}
        </span>
        <span
          className={clsx("ml-auto text-lg font-bold leading-tight", {
            "text-white": isActive,
            "text-orange-100/25 group-hover:text-white": !isActive,
          })}
        >
          {count}
        </span>
      </div>

      {isActive && (
        <div className="mt-0.5">
          {continents.map(([continent, n]) => (
            <SlotRow
              key={continent}
              continent={continent}
              count={n}
              slots={slots}
            />
          ))}
        </div>
      )}
    </a>
  );
}

function SlotRow({
  continent,
  count,
  slots,
}: {
  continent: string;
  count: number;
  slots: number;
}) {
  const overflow = count - slots;

  return (
    <div className="flex items-center gap-1.5 h-5">
      <span className="w-5 shrink-0 text-[0.65rem] text-orange-300/70">
        {continent.toUpperCase()}
      </span>
      <div className="flex gap-[3px]">
        {Array.from({ length: slots }, (_, i) => (
          <span
            key={i}
            className={clsx("size-2 rounded-full", {
              "bg-orange-500": i < count,
              "bg-white/10": i >= count,
            })}
          />
        ))}
      </div>
      {overflow > 0 && (
        <span className="text-xs text-orange-300">+{overflow}</span>
      )}
      <span className="ml-auto text-xs tabular-nums text-orange-200">
        {Math.min(count, slots)}/{slots}
      </span>
    </div>
  );
}

// horizontal variant, shown at the top when the sidebar is below the servers
export function QWLeagueBanner({
  stats,
  className,
}: {
  stats: QueueStats | null;
  className?: string;
}) {
  // qwleague.com not reachable (yet)
  if (!stats) {
    return null;
  }

  const showQueue = !(stats.matchmaking_enabled && stats.waiting === 0);

  return (
    <div
      className={clsx(
        "rounded-md border border-orange-900/60 bg-linear-to-r from-orange-950/80 via-orange-950/40 to-orange-950/20",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-3 py-1.5 sm:px-4">
        <div
          className={clsx("flex shrink-0 items-center gap-x-4", {
            "lg:block": showQueue,
          })}
        >
          <a
            href={QWLEAGUE_URL}
            target="_top"
            title="QWLeague.com"
            className="flex items-center transition hover:brightness-125"
          >
            <img
              src="/assets/img/qwleague_logo.svg"
              alt="QWLeague"
              // the svg has a spark above the shield, nudge up to center the shield on the text
              className="h-[18px] w-auto -translate-y-0.5"
            />
            <h2 className="ml-1.5 text-[0.9rem] font-bold text-[#ff3b1f]">
              QWLeague
            </h2>
          </a>
          {stats.matchmaking_enabled && (
            <div className="text-xs text-orange-200">
              <WaitingCount count={stats.waiting} /> in queue
            </div>
          )}
        </div>

        {showQueue && (
          <div className="w-full min-w-0 lg:w-auto lg:flex-1">
            <BannerQueue stats={stats} />
          </div>
        )}
      </div>
    </div>
  );
}

function BannerQueue({ stats }: { stats: QueueStats }) {
  if (!stats.matchmaking_enabled) {
    return (
      <div className="text-sm text-orange-100/60">
        Matchmaking is currently paused.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {sortedModes(stats).map(([mode, count]) => (
        <ModeChip
          key={mode}
          mode={mode}
          label={MODE_LABELS[mode] ?? mode}
          count={count}
          slots={MODE_SLOTS[mode] ?? 2}
          continents={sortedContinents(stats, mode)}
        />
      ))}
    </div>
  );
}

function ModeChip({
  mode,
  label,
  count,
  slots,
  continents,
}: {
  mode: string;
  label: string;
  count: number;
  slots: number;
  continents: [string, number][];
}) {
  const isActive = count > 0;

  return (
    <a
      href={`${QWLEAGUE_URL}/play?mode=${encodeURIComponent(mode)}`}
      target="_top"
      title={`Play ${label} (${count} in queue)`}
      className={clsx(
        "group flex items-center gap-2 rounded border px-2.5 py-1.5 transition-colors",
        {
          "border-orange-700/60 bg-orange-900/30 hover:border-orange-600 hover:bg-orange-900/50":
            isActive,
          "hidden sm:flex border-white/5 bg-black/20 hover:border-orange-600 hover:bg-orange-900/50":
            !isActive,
        },
      )}
    >
      <span
        className={clsx("text-sm font-semibold", {
          "text-orange-300": isActive,
          "text-orange-100/40 group-hover:text-orange-300": !isActive,
        })}
      >
        {label}
      </span>
      <span
        className={clsx("text-sm font-bold", {
          "text-white": isActive,
          "text-orange-100/25 group-hover:text-white": !isActive,
        })}
      >
        {count}
      </span>

      {isActive &&
        continents.map(([continent, n]) => (
          <span
            key={continent}
            className="text-xs tabular-nums text-orange-200"
          >
            <span className="text-[0.65rem] text-orange-300/70">
              {continent.toUpperCase()}
            </span>{" "}
            {Math.min(n, slots)}/{slots}
          </span>
        ))}
    </a>
  );
}
