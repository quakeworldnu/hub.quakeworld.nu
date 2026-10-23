import { PrimaryButton, SecondaryButton } from "@qwhub/Buttons.tsx";
import { QuakeText } from "@qwhub/QuakeText.tsx";
import { Lastscores } from "@qwhub/servers/Lastscores.tsx";
import { Mapshot } from "@qwhub/servers/Mapshot.tsx";
import {
  freePlayerSlots,
  freeSpectatorSlots,
  isQwleagueHostname,
  isQwleagueOfficial,
  qtvClientCount,
  qwleagueCountryCode,
  scoreboardPlayers,
  scoreboardTeams,
} from "@qwhub/servers/util.ts";
import { getFlagUrl } from "@qwhub/services/flags.ts";
import type { Server as ServerType } from "@qwhub/services/qworld/types.ts";
import copyToClipboard from "copy-text-to-clipboard";
import React, { useState } from "react";
import { Scoreboard } from "./Scoreboard.tsx";
import ServerStreams from "./ServerStreams.tsx";

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
            href={`qw://${server.address}/`}
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

export const ServerBody = (props: { server: ServerType }) => {
  const { server } = props;
  const serverMeta = server.meta;
  const [view, setView] = useState(VIEWS.Scoreboard);
  const isQwleague = isQwleagueHostname(server.info.hostname);

  if (view === VIEWS.Lastscores) {
    return (
      <Lastscores
        address={server.address}
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

export const Matchtag = ({ text = "" }: { text?: string | null }) => {
  if ((text ?? "").trim().length === 0) {
    return null;
  }

  return (
    <div className="mb-3 py-1.5 uppercase font-bold tracking-widest text-xs text-center w-full bg-gradient-to-r from-red-600/0 via-red-600 app-text-shadow">
      {text}
    </div>
  );
};

export const QWLeagueBanner = ({
  matchtag = "",
  hostname = "",
}: {
  matchtag?: string | null;
  hostname?: string | null;
}) => {
  const showMatchtag = (matchtag ?? "").trim().length > 0;
  const matchtagColor = isQwleagueOfficial(hostname, matchtag)
    ? "bg-yellow-500"
    : "bg-red-600";

  return (
    <div className="flex items-stretch w-full bg-black/70 uppercase font-bold tracking-widest text-xs app-text-shadow">
      {showMatchtag && (
        <div
          className={`py-1.5 pl-2 sm:pl-3 pr-5 ${matchtagColor} [clip-path:polygon(0_0,100%_0,calc(100%-8px)_100%,0_100%)]`}
        >
          {matchtag}
        </div>
      )}
      <a
        href="https://qwleague.com"
        target="_top"
        title="QWLeague"
        className="relative z-10 flex items-center ml-auto py-1.5 px-2 sm:px-3 text-[#999] hover:text-white transition-colors"
      >
        <img
          src="/assets/img/qwleague_logo.svg"
          alt="qwleague"
          className="h-4 w-auto mr-[5px]"
        />
        QWLeague.com
      </a>
    </div>
  );
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
            href={`qw://${server.address}/observe`}
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
          <div className="sm:grow">
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
        <div className="flex text-xs justify-between">
          <ServerAddress server={server} />

          {server.info.ktxver && <KtxVersion version={server.info.ktxver} />}
        </div>
      </div>
    </div>
  );
};

export const ServerAddress = (props: { server: ServerType }) => {
  const { server } = props;
  const cc = qwleagueCountryCode(server.info.hostname) || server.meta.geo.cc;

  return (
    <div
      className="server-address flex items-center cursor-pointer text-gray-400"
      onClick={() => copyToClipboard(server.meta.hostport)}
      title="Copy IP to clipboard"
    >
      <ServerAddressTitle cc={cc} title={server.meta.addressTitle} />
      <img
        src="https://hub.quakeworld.nu/assets/img/icons/content_paste.svg"
        width="12"
        alt=""
        className="app-icon ml-1 inline"
      />
    </div>
  );
};

export const ServerAddressTitle = React.memo(
  (props: { cc: string; title: string }) => {
    const { cc, title } = props;

    return (
      <div className="flex items-center max-w-[260px] truncate">
        {cc && (
          <img
            src={getFlagUrl(cc)}
            alt={cc}
            className="inline h-3 w-auto mr-1.5 mb-[1px]"
          />
        )}
        {title}
      </div>
    );
  },
);

const KtxVersion = React.memo((props: { version: string }) => {
  const { version } = props;
  const label = `KTX ${version}`;

  return (
    <div
      className="text-right w-20 overflow-hidden whitespace-nowrap text-ellipsis text-white/40"
      title={label}
    >
      {label}
    </div>
  );
});

// memo: unchanged servers keep their object identity between polls (rtk query structural sharing)
export const Server = React.memo((props: { server: ServerType }) => {
  const { server } = props;

  return (
    <div className={`w-full flex flex-col ${server.meta.wrapperClassNames}`}>
      <div className="server flex flex-col h-full bg-[#445]">
        <ServerHeader server={server} />
        <ServerBody server={server} />
        <ServerFooter server={server} />
      </div>
    </div>
  );
});
