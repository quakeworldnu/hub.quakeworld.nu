import React, { Fragment, useState } from "react";
import copyToClipboard from "copy-text-to-clipboard";
import { Scoreboard } from "./Scoreboard";
import { QuakeText } from "@/QuakeText";
import { PrimaryButton, SecondaryButton } from "@/Buttons";
import ServerStreams from "./ServerStreams";
import { Lastscores } from "@/servers/Lastscores";
import { Mapshot } from "@/servers/Mapshot";

const VIEWS = {
  Scoreboard: "Scoreboard",
  Lastscores: "Lastscores",
};

const ServerProgress = React.memo((props) => {
  const { value, max } = props;
  const progress = 100 * (value / max);
  const width = `${progress}%`;

  return (
    <div className="server-progress">
      <div className="server-progress-bar" style={{ width }} />
    </div>
  );
});

const ServerHeader = (props) => {
  const { server } = props;
  const JoinButtonEl =
    server.player_slots.free > 0 ? PrimaryButton : SecondaryButton;

  return (
    <div className="border-b border-black">
      <div className="flex justify-between p-2 sm:p-3">
        <ServerStatus
          mode={server.mode}
          map={server.settings.map}
          statusName={server.status.name}
          statusDescription={server.status.description}
        />
        <div className="hidden sm:flex">
          <JoinButtonEl
            href={`qw://${server.address}/`}
            className="flex items-center px-5 text-lg rounded-lg"
          >
            Join
          </JoinButtonEl>
        </div>
      </div>
      {server.time.total > 0 &&
        ["Started", "Countdown"].includes(server.status.name) && (
          <ServerProgress value={server.time.elapsed} max={server.time.total} />
        )}
    </div>
  );
};

const ServerStatus = React.memo((props) => {
  const { mode, map, statusName, statusDescription } = props;

  return (
    <div className="flex grow justify-between sm:block">
      <div>
        <strong>{mode}</strong> on <strong>{map}</strong>
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

export const ServerBody = (props) => {
  const { server } = props;
  const serverMeta = server.meta;
  const [view, setView] = useState(VIEWS.Scoreboard);

  if (view === VIEWS.Lastscores) {
    return (
      <Lastscores
        address={server.address}
        onClose={() => setView(VIEWS.Scoreboard)}
      />
    );
  } else if (view === VIEWS.Scoreboard) {
    return (
      <Mapshot map={serverMeta.mapName}>
        <div className="flex flex-col h-full group py-4 min-h-[96px] sm:min-h-[200px] bg-gray-700/20">
          <div className="flex transition-opacity opacity-40 group-hover:opacity-100 ml-4 space-x-2 absolute">
            <a
              href={`/scoreboard/?address=${server.address}`}
              title="Show scoreboard in separate window"
              className="p-1 rounded-full bg-black/70 opacity-60 hover:opacity-100"
            >
              <img
                src="/assets/img/icons/launch.svg"
                width={24}
                height={24}
                alt=""
              />
            </a>
            {server.meta.supportsLastscores && (
              <div
                className="p-1 rounded-full bg-black/70 cursor-pointer opacity-60 hover:opacity-100"
                onClick={() => setView(VIEWS.Lastscores)}
              >
                <img
                  src="/assets/img/icons/history.svg"
                  width={24}
                  height={24}
                  alt=""
                  title="Show lastscores"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center items-center h-full px-2">
            {serverMeta.matchtag && (
              <div className="py-1.5 mb-3 uppercase font-bold tracking-widest text-xs text-center w-full bg-gradient-to-r from-red-600/0 via-red-600 app-text-shadow">
                {serverMeta.matchtag}
              </div>
            )}
            <Scoreboard
              server={server}
              limit={serverMeta.playerDisplay.visible}
            />
            <HiddenPlayers count={serverMeta.playerDisplay.hidden} />
            <SpectatorText text={serverMeta.spectatorText} />
          </div>
        </div>
      </Mapshot>
    );
  }
};

const HiddenPlayers = React.memo((props) => {
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

const SpectatorText = React.memo((props) => {
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

const SpectatorButtons = (props) => {
  const { server } = props;

  return (
    <Fragment>
      <div className="hidden sm:block">
        <SecondaryButton
          href={`qw://${server.address}/observe`}
          count={server.spectator_slots.used}
        >
          Spectate
        </SecondaryButton>
      </div>

      {server.qtv_stream.address !== "" && (
        <div className="hidden sm:block">
          <SecondaryButton
            href={`qw://${server.qtv_stream.url}/qtvplay`}
            count={server.qtv_stream.spectator_count}
          >
            QTV
          </SecondaryButton>
        </div>
      )}
      {<ServerStreams address={server.address} />}
    </Fragment>
  );
};

const ServerFooter = (props) => {
  const { server } = props;

  return (
    <div className="p-2 sm:p-3 border-t border-t-black bg-[#334] text-sm grid grid-cols-2 gap-2">
      <SpectatorButtons server={server} />

      <div className="col-span-2">
        <div className="flex text-xs justify-between">
          <ServerAddress server={server} />

          {server.settings.ktxver && (
            <KtxVersion version={server.settings.ktxver} />
          )}
        </div>
      </div>
    </div>
  );
};

export const ServerAddress = (props) => {
  const { server } = props;

  return (
    <div
      className="server-address flex items-center cursor-pointer text-white/60"
      onClick={() => copyToClipboard(server.settings.hostname_parsed)}
      title="Copy IP to clipboard"
    >
      <ServerAddressTitle cc={server.geo.cc} title={server.meta.addressTitle} />
      <img
        src="/assets/img/icons/content_paste.svg"
        width="12"
        alt=""
        className="app-icon ml-1 inline"
      />
    </div>
  );
};

const ServerAddressTitle = React.memo((props) => {
  const { cc, title } = props;

  return (
    <div className="flex items-center max-w-[260px] truncate">
      {cc && (
        <img
          src={`https://www.quakeworld.nu/images/flags/${cc.toLowerCase()}.gif`}
          width="16"
          height="11"
          alt={cc}
          className="inline mr-1 mb-[1px]"
        />
      )}
      {title}
    </div>
  );
});

const KtxVersion = React.memo((props) => {
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

export const Server = (props) => {
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
};
