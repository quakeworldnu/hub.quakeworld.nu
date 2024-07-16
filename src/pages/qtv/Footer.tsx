// @ts-ignore
import { SecondaryButton } from "@qwhub/Buttons";
import { useEventListener } from "@qwhub/pages/games/hooks";
import { MvdsvServer } from "@qwhub/pages/qtv/types";
// @ts-ignore
import { selectQtvServers } from "@qwhub/selectors";
// @ts-ignore
import { Mapshot } from "@qwhub/servers/Mapshot";
// @ts-ignore
import { ServerAddress } from "@qwhub/servers/Server";
// @ts-ignore
import ServersStreams from "@qwhub/servers/ServerStreams";
import { useState } from "react";
import { useSelector } from "react-redux";

export function QtvPlayerFooter() {
  const servers: MvdsvServer[] = useSelector(selectQtvServers);
  const [address, setAddress] = useState<string>("");

  useEventListener("hub.selectServer", ({ detail: server }) => {
    servers.find((s) => s.address === server.address) &&
      setAddress(server.address);
  });

  const server = servers.find((s) => s.address === address);

  if (!server) {
    return null;
  }

  const title = server.title.replace(` [${server.settings.map}]`, "");

  return (
    <div className="flex flex-wrap justify-between gap-4 my-4">
      <div className="flex items-center gap-4">
        <div className="hidden sm:block h-20 w-28">
          <Mapshot map={server.settings.map} />
        </div>
        <div className="">
          <div className="font-bold">{title}</div>
          <div className="text-sm mt-1 text-slate-300">
            <strong>{server.settings.map}</strong>: {server.status.name} -{" "}
            {server.status.description}
          </div>
          <div className="text-xs mt-2.5">
            <div className="flex gap-4">
              <ServerAddress server={server} />
              <div className="text-right text-xs">
                <div className="inline-block h-1.5 w-1.5 rounded-full bg-red-600 mr-1 mb-px" />
                <span className="text-slate-300">
                  {server.spectator_slots.used +
                    server.qtv_stream.spectator_names.length}{" "}
                  viewers
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
        >
          Join as Player
        </SecondaryButton>

        <SecondaryButton
          href={`qw://${server.address}/observe`}
          count={server.spectator_slots.used}
        >
          Join as spectator
        </SecondaryButton>

        <SecondaryButton
          href={`qw://${server.qtv_stream.url}/qtvplay`}
          count={server.qtv_stream.spectator_count}
        >
          Watch on QTV
        </SecondaryButton>

        <ServersStreams address={server.address} />
      </div>
    </div>
  );
}
