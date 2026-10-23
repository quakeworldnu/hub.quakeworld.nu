import { useState } from "react";
import { useEventListener } from "usehooks-ts";
import { presets, Shortcuts } from "@/components/fte-player/shortcuts";
import { ServerAddress } from "@/components/server/server-address";
import ServersStreams from "@/components/streams/server-streams";
import { SecondaryButton } from "@/components/ui/buttons";
import { QtvEvent } from "@/features/qtv/events";
import { useQtvServers } from "@/lib/qworld/server-hooks";
import {
  qtvClientCount,
  statusText,
  totalSpectatorCount,
} from "@/lib/qworld/server-utils";
import type { Server } from "@/lib/qworld/types";
import { getMapshotCssUrl } from "@/utils/mapshots";

export function QtvPlayerFooter() {
  const servers: Server[] = useQtvServers();
  const [address, setAddress] = useState<string>("");

  useEventListener(QtvEvent.SelectServer, ({ detail: server }) => {
    servers.find((s) => s.address === server.address) &&
      setAddress(server.address);
  });

  const server = servers.find((s) => s.address === address);

  if (!server) {
    return null;
  }

  const title = server.meta.title.replace(` [${server.info.map}]`, "");

  return (
    <div>
      <div className="flex flex-wrap justify-between gap-4 my-6">
        <div className="flex items-center gap-4 gap-x-6">
          <div
            className="hidden sm:block h-20 w-32 bg-cover bg-center rounded"
            style={{ backgroundImage: getMapshotCssUrl(server.info.map) }}
          />
          <div className="">
            <div className="font-bold sm:text-lg md:text-xl">{title}</div>
            <div className="text-sm mt-1 text-slate-300">
              <strong>{server.info.map}</strong>: {statusText(server)}
            </div>
            <div className="text-xs mt-2.5">
              <div className="flex gap-4">
                <ServerAddress server={server} />
                <div className="text-right text-xs">
                  <div className="inline-block h-1.5 w-1.5 rounded-full bg-red-600 mr-1 mb-px" />
                  <span className="text-slate-300">
                    {totalSpectatorCount(server)} viewers
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex gap-3 h-6 md:h-8 text-xs">
          <SecondaryButton
            href={`qw://${server.address}/`}
            className="flex items-center px-2"
            title="Join as player"
          >
            <QuakeLogo />
            Join
          </SecondaryButton>

          <SecondaryButton
            href={`qw://${server.address}/observe`}
            count={server.spectators.length}
            title="Join as spectator"
          >
            <QuakeLogo />
            Spectate
          </SecondaryButton>

          <SecondaryButton
            href={`qw://${server.qtv_stream?.url}/qtvplay`}
            count={qtvClientCount(server)}
            title="Join QTV"
          >
            <QuakeLogo />
            QTV
          </SecondaryButton>

          <ServersStreams server={server} />
        </div>
      </div>

      <div className="hidden lg:block">
        <hr className="my-6 border-slate-800" />
        <Shortcuts preset={presets.qtvPlayer} />
      </div>
    </div>
  );
}

function QuakeLogo() {
  return (
    <img
      src="/assets/img/quake_logo.svg"
      className="w-3 invert mr-1.5"
      alt="Quake logo"
    />
  );
}
