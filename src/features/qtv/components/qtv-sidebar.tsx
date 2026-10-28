import {
  faAnglesLeft,
  faAnglesRight,
  faBars,
  faServer,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { Fragment, type ReactNode, useState } from "react";
import { useEventListener, useLocalStorage, useMediaQuery } from "usehooks-ts";
import { QWLeagueBanner } from "@/components/scoreboard/qwleague-banner";
import { SimpleScoreboard } from "@/components/scoreboard/simple-scoreboard";
import { FontAwesomeIcon } from "@/components/ui/icon";
import { QuakeText, quakeStringToHtml } from "@/components/ui/quake-text";
import { QtvEvent, selectServer } from "@/features/qtv/events";
import { useQtvServers } from "@/lib/qworld/server-hooks";
import {
  isQwleagueHostname,
  qwleagueCountryCode,
} from "@/lib/qworld/server-utils";
import type { Server } from "@/lib/qworld/types";
import { getFlagUrl } from "@/utils/flags";
import { getSearchParam } from "@/utils/search-params";

type DisplayMode = "brief" | "detailed";

export function QtvPlayerSidebar() {
  const servers = useQtvServers();
  const isSmallDevice = useMediaQuery("(max-width: 767px)");
  // derived from viewport size until the user toggles it
  const [userExpanded, setUserExpanded] = useState<boolean | null>(null);
  const isExpanded = userExpanded ?? !isSmallDevice;
  const [highlightEdge, setHighlightEdge] = useState(false);

  // the collapse button unmounts without a pointerleave, reset its edge highlight here
  function collapse() {
    setUserExpanded(false);
    setHighlightEdge(false);
  }
  const [displayMode, setDisplayMode] = useLocalStorage<DisplayMode>(
    "qtvServerDisplayMode",
    "detailed",
  );
  const [selectedAddress, setSelectedAddress] = useState(
    getSearchParam("address") ?? "",
  );

  useEventListener(QtvEvent.SelectServer, ({ detail: server }) => {
    setSelectedAddress(server.address);
  });

  if (!isExpanded) {
    return (
      <button
        type="button"
        title="Show servers"
        className="flex flex-col items-center shrink-0 w-12 pt-4 border-r-8 border-black hover:border-sky-600 hover:bg-[#242434] transition-colors text-slate-400 hover:text-white cursor-e-resize"
        onClick={() => setUserExpanded(true)}
      >
        <FontAwesomeIcon icon={faAnglesRight} />
        <div className="mt-8 text-sky-400 space-y-1">
          <FontAwesomeIcon icon={faServer} />
          <div className="text-sm font-semibold">{servers.length}</div>
        </div>
      </button>
    );
  }

  return (
    <>
      {/* absolute: the list scrolls within the player height instead of stretching it */}
      <div className="relative w-sm max-w-[80vw] shrink-0">
        <aside className="absolute inset-0 flex flex-col bg-[#1a1a2a]">
          <div className="h-14 shrink-0 flex items-center justify-between pl-4 border-b border-[#334] text-slate-400">
            <span className="font-semibold">Servers</span>
            <div className="flex">
              <ModeButton
                title="Detailed"
                isActive={displayMode === "detailed"}
                onClick={() => setDisplayMode("detailed")}
              >
                <FontAwesomeIcon icon={faSquare} />
              </ModeButton>
              <ModeButton
                title="Brief"
                isActive={displayMode === "brief"}
                onClick={() => setDisplayMode("brief")}
              >
                <FontAwesomeIcon icon={faBars} />
              </ModeButton>
            </div>
            <button
              type="button"
              title="Hide servers"
              className="size-10 mr-2 grid place-items-center rounded hover:bg-white/10 hover:text-white cursor-w-resize"
              onClick={collapse}
              onPointerEnter={() => setHighlightEdge(true)}
              onPointerLeave={() => setHighlightEdge(false)}
              onBlur={() => setHighlightEdge(false)}
            >
              <FontAwesomeIcon icon={faAnglesLeft} />
            </button>
          </div>
          <div
            className={clsx("flex-1 min-h-0 overflow-y-auto", {
              "space-y-1": displayMode === "brief",
            })}
          >
            {servers.map((server) => (
              <ServerLink
                key={server.address}
                server={server}
                displayMode={displayMode}
                isSelected={server.address === selectedAddress}
              />
            ))}
          </div>
        </aside>
      </div>
      <button
        type="button"
        title="Hide servers"
        className={clsx(
          "w-2 shrink-0 hover:bg-sky-600 cursor-w-resize",
          highlightEdge ? "bg-sky-600" : "bg-black",
        )}
        onClick={collapse}
      />
    </>
  );
}

const ModeButton = ({
  title,
  isActive,
  onClick,
  children,
}: {
  title: string;
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    title={title}
    className={clsx(
      "px-3 h-8 text-sm first:rounded-l last:rounded-r border border-[#334]",
      isActive
        ? "bg-slate-600 text-white"
        : "bg-white/5 hover:bg-white/10 hover:text-white",
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

const ServerLink = ({
  server,
  displayMode,
  isSelected,
}: {
  server: Server;
  displayMode: DisplayMode;
  isSelected: boolean;
}) => {
  const isDetailed = displayMode === "detailed";
  const mode = server.game_mod ?? server.player_mode;
  const spectatorCount = server.total_spectator_count;
  const matchtag = server.info.matchtag;
  const cc = countryCode(server);
  const isQwleague = isQwleagueHostname(server.info.hostname);
  const showBanner = isDetailed && isQwleague;
  const spectators = spectatorCount > 0 && (
    <span title={`${spectatorCount} spectators`}>
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-600 mr-1 mb-px" />
      {spectatorCount}
    </span>
  );
  const matchtagLabel = matchtag && !showBanner && (
    <>
      {isQwleague && (
        <img
          src="/assets/img/qwleague_logo.svg"
          alt="qwleague"
          title="QWLeague"
          className="h-3.5 w-auto mr-1"
        />
      )}
      <span className="uppercase font-bold bg-linear-to-b from-pink-400 to-pink-600 bg-clip-text text-transparent">
        {matchtag}
      </span>
    </>
  );

  return (
    <a
      href={`/qtv/?address=${server.address}`}
      className={clsx(
        "block hover:bg-[#242434] aria-[current=true]:border-l-3 border-l-sky-600 aria-[current=true]:bg-[#242434] text-sm",
        { "not-last:border-b border-b-[#334]": isDetailed },
      )}
      aria-current={isSelected ? "true" : undefined}
      onClick={(e) => {
        e.preventDefault();
        selectServer(server);
      }}
    >
      {showBanner && (
        <QWLeagueBanner
          matchtag={server.meta.matchtag}
          hostname={server.info.hostname}
          isLink={false}
        />
      )}
      <div className={clsx({ "py-4": isDetailed, "pl-4 py-2": !isDetailed })}>
        {isDetailed ? (
          <SimpleScoreboard
            players={server.players}
            teams={server.teams}
            mode={server.player_mode}
            gameMod={server.game_mod}
          />
        ) : (
          <div className="flex items-center">
            {cc && (
              <img
                src={getFlagUrl(cc)}
                alt={cc}
                className="h-3 w-auto mr-1.5"
              />
            )}
            <QuakeText
              tag="span"
              text={quakeStringToHtml({
                ascii: server.info.hostname,
                unicode: server.info.hostname,
              })}
            />
          </div>
        )}
        <div className={clsx("text-xs", { "text-center mt-2": isDetailed })}>
          <span className="inline-flex items-center text-slate-400">
            {isDetailed ? (
              <DotDelimited
                items={[
                  mode,
                  server.info.map,
                  server.info.status,
                  spectators,
                  matchtagLabel,
                ]}
              />
            ) : (
              <DotDelimited
                items={[
                  mode,
                  `${server.players.length}/${server.player_limit}`,
                  server.info.map,
                  server.info.status,
                  matchtagLabel,
                  spectators,
                ]}
              />
            )}
          </span>
        </div>
      </div>
    </a>
  );
};

// delimiters only between present items
const DotDelimited = ({ items }: { items: ReactNode[] }) => (
  <>
    {items
      .filter(
        (item) =>
          item !== null && item !== undefined && item !== false && item !== "",
      )
      .map((item, index) => (
        <Fragment key={index}>
          {index > 0 && <DotDelimiter />}
          {item}
        </Fragment>
      ))}
  </>
);

const DotDelimiter = () => (
  <span className="inline-flex mx-1.5 bg-slate-600 size-[0.3em] min-w-[0.3em] min-h-[0.3em] rounded-full align-middle" />
);

function countryCode(server: Server): string {
  const cc = qwleagueCountryCode(server.info.hostname) || server.meta.geo.cc;
  return cc && cc !== "none" ? cc : "";
}
