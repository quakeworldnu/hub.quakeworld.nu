import React, { useState } from "react";
import { Mapshot } from "@/components/scoreboard/mapshot";
import { Matchtag } from "@/components/scoreboard/matchtag";
import { QWLeagueBanner } from "@/components/scoreboard/qwleague-banner";
import { Scoreboard } from "@/components/scoreboard/scoreboard";
import { CopyAddressButton } from "@/components/server/copy-address-button";
import { ServerAddress } from "@/components/server/server-address";
import ServerStreams from "@/components/streams/server-streams";
import { PrimaryButton, SecondaryButton } from "@/components/ui/buttons";
import { Dialog } from "@/components/ui/dialog";
import { PingIndicator } from "@/components/ui/ping-indicator";
import { QuakeText, quakeStringToHtml } from "@/components/ui/quake-text";
import { useShowServerPing } from "@/features/servers/hooks/use-show-server-ping";
import { useShowServerScores } from "@/features/servers/hooks/use-show-server-scores";
import {
  freePlayerSlots,
  freeSpectatorSlots,
  isQwleagueHostname,
  qtvClientCount,
  scoreboardPlayers,
  scoreboardTeams,
} from "@/lib/qworld/server-utils";
import { useStunPing } from "@/lib/qworld/stun-ping";
import type { Server as ServerType } from "@/lib/qworld/types";
import { Lastscores } from "./lastscores";

const VIEWS = {
  Scoreboard: "Scoreboard",
  Lastscores: "Lastscores",
};

const ServerProgress = React.memo((props: { value: number; max: number }) => {
  const { value, max } = props;
  const progress = 100 * (value / max);
  const width = `${progress}%`;

  return (
    <div className="server-progress">
      <div className="server-progress-bar" style={{ width }} />
    </div>
  );
});

const ServerHeader = (props: { server: ServerType }) => {
  const { server } = props;
  const JoinButtonEl =
    freePlayerSlots(server) > 0 ? PrimaryButton : SecondaryButton;

  return (
    <div className="border-b border-black">
      <div className="flex justify-between p-2 sm:p-3">
        <ServerStatus
          mode={server.meta.mode}
          map={server.info.map}
          statusName={server.meta.status.name}
          statusDescription={server.meta.status.description}
        />
        <div className="hidden sm:flex">
          <JoinButtonEl
            href={`qw://${server.meta.connectAddress}/`}
            className="flex items-center px-5 text-lg rounded-lg"
            title="Join as player"
          >
            Join
          </JoinButtonEl>
        </div>
      </div>
      {server.meta.time.total > 0 && "Started" === server.meta.status.name && (
        <ServerProgress
          value={server.meta.time.elapsed}
          max={server.meta.time.total}
        />
      )}
    </div>
  );
};

type ServerStatusProps = {
  mode: string;
  map: string;
  statusName: string;
  statusDescription: string;
};

const ServerStatus = React.memo((props: ServerStatusProps) => {
  const { mode, map, statusName, statusDescription } = props;

  return (
    <div className="flex grow justify-between sm:block">
      <div>
        {mode && (
          <>
            <strong>{mode}</strong> on{" "}
          </>
        )}
        <strong>{map}</strong>
      </div>
      <div>
        {["Started", "Countdown"].includes(statusName) && (
          <span className="mr-1 px-1 py-0.5 rounded-sm font-mono text-xs bg-red-600 app-text-shadow">
            LIVE
          </span>
        )}{" "}
        <span className="text-gray-300 text-xs">{statusDescription}</span>
      </div>
    </div>
  );
});

export const ServerBody = (props: {
  server: ServerType;
  showScores?: boolean;
}) => {
  const { server, showScores = true } = props;
  const serverMeta = server.meta;
  const [view, setView] = useState(VIEWS.Scoreboard);
  const isQwleague = isQwleagueHostname(server.info.hostname);

  if (view === VIEWS.Lastscores) {
    return (
      <Lastscores
        address={server.address}
        connectAddress={server.meta.connectAddress}
        onClose={() => setView(VIEWS.Scoreboard)}
      />
    );
  }
  if (view === VIEWS.Scoreboard) {
    return (
      <Mapshot map={server.info.map}>
        <div className="flex flex-col h-full">
          {isQwleague && (
            <QWLeagueBanner
              matchtag={serverMeta.matchtag}
              hostname={server.info.hostname}
            />
          )}
          <div className="flex flex-col grow group py-4 min-h-[96px] sm:min-h-[200px] bg-gray-700/20">
            <div className="flex transition-opacity opacity-0 group-hover:opacity-100 ml-4 space-x-2 absolute">
              <a
                href={`https://hub.quakeworld.nu/scoreboard/?address=${server.address}`}
                title="Show scoreboard in separate window"
                className="p-1 rounded-full bg-gray-950 opacity-60 hover:opacity-100"
                target="_top"
              >
                <img
                  src="https://hub.quakeworld.nu/assets/img/icons/launch.svg"
                  width={24}
                  height={24}
                  alt=""
                />
              </a>
              {server.meta.supportsLastscores && (
                <div
                  className="p-1 rounded-full bg-gray-950 cursor-pointer opacity-60 hover:opacity-100"
                  onClick={() => setView(VIEWS.Lastscores)}
                >
                  <img
                    src="https://hub.quakeworld.nu/assets/img/icons/history.svg"
                    width={24}
                    height={24}
                    alt=""
                    title="Show lastscores"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center items-center grow px-2">
              {!isQwleague && <Matchtag text={serverMeta.matchtag} />}
              <Scoreboard
                players={scoreboardPlayers(server)}
                teams={scoreboardTeams(server)}
                limit={serverMeta.playerDisplay.visible}
                showFrags={showScores}
                presorted={showScores}
              />
              <HiddenPlayers count={serverMeta.playerDisplay.hidden} />
              <SpectatorText text={serverMeta.spectatorText} />
            </div>
          </div>
        </div>
      </Mapshot>
    );
  }
};

const HiddenPlayers = React.memo((props: { count: number }) => {
  const { count } = props;

  if (0 === count) {
    return null;
  }

  return (
    <div className="mt-1 text-xs text-gray-300">
      +{count} {1 === count ? "player" : "players"}
    </div>
  );
});

const SpectatorText = React.memo((props: { text: string }) => {
  const { text } = props;

  if ("" === text) {
    return null;
  }

  return (
    <div className="text-xs text-center mt-3 text-white/70 app-text-shadow">
      <span className="qw-color-b">specs:</span>{" "}
      <QuakeText tag="span" text={text} />
    </div>
  );
});

export const SpectatorButtons = (props: { server: ServerType }) => {
  const { server } = props;

  return (
    <>
      {freeSpectatorSlots(server) > 0 && (
        <div className="hidden sm:block sm:grow">
          <SecondaryButton
            href={`qw://${server.meta.connectAddress}/observe`}
            count={server.spectators.length}
            title="Join as spectator"
          >
            Spectate
          </SecondaryButton>
        </div>
      )}
      {server.qtv_stream && (
        <>
          <div className="hidden sm:block sm:grow">
            <SecondaryButton
              key={"qtv"}
              href={`qw://${server.qtv_stream.url}/qtvplay`}
              count={qtvClientCount(server)}
              title="Join QTV"
            >
              QTV
            </SecondaryButton>
          </div>
          <div className="hidden sm:block sm:grow">
            <SecondaryButton
              key={"qtv-web"}
              href={`/qtv/?address=${server.address}`}
              count={0}
              title="Watch QTV in browser"
            >
              Web QTV
            </SecondaryButton>
          </div>
        </>
      )}
      {<ServerStreams server={server} />}
    </>
  );
};

const ServerFooter = (props: { server: ServerType }) => {
  const { server } = props;

  return (
    <div className="p-2 sm:p-3 border-t border-t-black bg-[#334] text-sm flex flex-wrap gap-2">
      <SpectatorButtons server={server} />

      <div className="w-full">
        <div className="flex items-center gap-2 text-xs justify-between">
          <ServerAddress server={server} />

          {/* never wraps, the address is truncated instead */}
          <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
            <ServerVersion server={server} />
            <ServerPing ip={server.ip} />
          </div>

          {server.qtv_stream && (
            <SecondaryButton
              href={`/qtv/?address=${server.address}`}
              className="sm:hidden px-2 py-0.5"
              title="Watch QTV in browser"
            >
              Web QTV
            </SecondaryButton>
          )}
        </div>
      </div>
    </div>
  );
};

const truncate = (text: string, maxLength: number): string =>
  text.length > maxLength ? `${text.substring(0, maxLength - 1)}…` : text;

// browser => server ping (stun), opt-in, hidden on mobile (not measured there)
const ServerPing = (props: { ip: string }) => {
  const [showPing] = useShowServerPing();
  const ping = useStunPing(props.ip);

  if (!showPing || null === ping) {
    return null;
  }

  return (
    <span title="Round trip time from your browser (STUN)">
      <PingIndicator ms={ping} showUnit className="hidden md:inline-flex" />
    </span>
  );
};

// "KTX 1.42" or the server's *version, opens a dialog with all serverinfo
const ServerVersion = React.memo((props: { server: ServerType }) => {
  const { server } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { ktxver, "*version": version } = server.info;
  const label = ktxver ? `KTX ${ktxver}` : (version ?? "");

  if (!label) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="text-right whitespace-nowrap shrink-0 ml-2 text-white/40 hover:text-white cursor-pointer"
        title={`${label} (show server info)`}
        onClick={() => setIsOpen(true)}
      >
        {truncate(label, 16)}
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        label="Server info"
        className="animate-contentShow fixed left-[50%] top-[50%] m-0 w-full max-w-4xl max-h-[85vh] translate-x-[-50%] translate-y-[-50%] border border-slate-700 bg-slate-900 text-gray-300 p-5 shadow-lg sm:rounded-lg overflow-auto backdrop:bg-black/80"
      >
        <ServerInfoDetails server={server} onClose={() => setIsOpen(false)} />
      </Dialog>
    </>
  );
});

const ServerInfoDetails = (props: {
  server: ServerType;
  onClose: () => void;
}) => {
  const { server, onClose } = props;
  const entries = Object.entries(server.info).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return (
    <div className="text-sm">
      <div className="flex justify-between items-center gap-4 border-b border-b-slate-700 pb-2 mb-3">
        <div className="min-w-0">
          <div className="font-bold break-all">
            {server.info.hostname || server.meta.addressTitle}
          </div>
          <CopyAddressButton
            address={server.meta.connectAddress}
            className="-ml-1.5 mt-0.5"
          />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-full shrink-0"
          title="Close"
        >
          <img
            src="https://hub.quakeworld.nu/assets/img/icons/close.svg"
            width={12}
            height={12}
            alt="Close"
          />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ServerInfoClients server={server} />
        <table className="w-full text-xs self-start">
          <tbody>
            {entries.map(([key, value]) => (
              <tr key={key} className="odd:bg-white/5">
                <td className="py-1 px-2 font-mono text-gray-400 align-top whitespace-nowrap">
                  {key}
                </td>
                <td className="py-1 px-2 font-mono break-all">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// players (highest frags first) and spectators, time = minutes on the server
const ServerInfoClients = (props: { server: ServerType }) => {
  const { server } = props;
  const players = [...server.players].sort((a, b) => b.frags - a.frags);
  const showTeams = players.some((p) => p.team.ascii.length > 0);
  const th = "py-1 px-2 font-normal text-gray-400 text-left";
  const td = "py-1 px-2";

  return (
    <div className="self-start space-y-4 text-xs">
      {server.info.map && (
        <div className="aspect-video rounded overflow-hidden border border-slate-700">
          <Mapshot map={server.info.map}>
            <div className="flex items-end h-full p-2 bg-linear-to-t from-black/70 to-transparent to-50%">
              <span className="font-bold text-sm text-white text-shadow-md">
                {server.info.map}
              </span>
            </div>
          </Mapshot>
        </div>
      )}
      <table className="w-full">
        <thead>
          <tr className="border-b border-b-slate-700">
            <th className={th}>Player ({players.length})</th>
            {showTeams && <th className={th}>Team</th>}
            <th className={`${th} text-right!`}>Frags</th>
            <th className={`${th} text-right!`}>Ping</th>
            <th className={`${th} text-right!`}>Time</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.user_id} className="odd:bg-white/5">
              <td className={td}>
                <QuakeText
                  tag="span"
                  text={quakeStringToHtml(p.name)}
                  className="font-mono"
                />
                {p.bot && <span className="ml-1 text-gray-500">(bot)</span>}
              </td>
              {showTeams && (
                <td className={td}>
                  <QuakeText
                    tag="span"
                    text={quakeStringToHtml(p.team)}
                    className="font-mono"
                  />
                </td>
              )}
              <td className={`${td} text-right`}>{p.frags}</td>
              <td className={`${td} text-right text-gray-400`}>{p.ping}</td>
              <td className={`${td} text-right text-gray-400`}>{p.time}m</td>
            </tr>
          ))}
          {0 === players.length && (
            <tr>
              <td className={`${td} text-gray-500`} colSpan={5}>
                No players
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {server.spectators.length > 0 && (
        <table className="w-full">
          <thead>
            <tr className="border-b border-b-slate-700">
              <th className={th}>Spectator ({server.spectators.length})</th>
              <th className={`${th} text-right!`}>Ping</th>
              <th className={`${th} text-right!`}>Time</th>
            </tr>
          </thead>
          <tbody>
            {server.spectators.map((s) => (
              <tr key={s.name.unicode} className="odd:bg-white/5">
                <td className={td}>
                  <QuakeText
                    tag="span"
                    text={quakeStringToHtml(s.name)}
                    className="font-mono"
                  />
                </td>
                <td className={`${td} text-right text-gray-400`}>{s.ping}</td>
                <td className={`${td} text-right text-gray-400`}>{s.time}m</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// memo: unchanged servers keep their object identity between polls (rtk query structural sharing)
export const Server = React.memo((props: { server: ServerType }) => {
  const { server } = props;
  const [showScores] = useShowServerScores();

  return (
    <div className={`w-full flex flex-col ${server.meta.wrapperClassNames}`}>
      <div className="server flex flex-col h-full bg-[#445]">
        <ServerHeader server={server} />
        <ServerBody server={server} showScores={showScores} />
        <ServerFooter server={server} />
      </div>
    </div>
  );
});
