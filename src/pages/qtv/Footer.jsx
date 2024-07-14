import { PrimaryButton, SecondaryButton } from "@qwhub/Buttons.jsx";
import { useEventListener } from "@qwhub/pages/games/hooks";
import { Mapshot } from "@qwhub/servers/Mapshot.jsx";
import { ServerAddress } from "@qwhub/servers/Server.jsx";
import ServersStreams from "@qwhub/servers/ServerStreams.jsx";
import React, { useState } from "react";

export function QtvPlayerFooter() {
  const [server, setServer] = useState(null);

  useEventListener("hub.selectServer", ({ detail: server }) => {
    setServer(server);
  });

  if (!server) {
    return null;
  }

  const JoinButtonEl =
    server.player_slots.free > 0 ? PrimaryButton : SecondaryButton;

  return (
    <div className="flex flex-wrap justify-between gap-4 my-4">
      <div className="flex gap-4">
        <div className="h-20 w-28">
          <Mapshot map={server.settings.map} />
        </div>
        <div className="">
          <div className="font-bold">{server.title}</div>
          <div className="text-xs mt-px text-slate-200">
            {server.status.name} - {server.status.description}
          </div>
          <div className="text-xs mt-2">
            <ServerAddress server={server} />
          </div>
        </div>
      </div>
      <div className="hidden sm:flex gap-3 h-6 md:h-8 text-xs">
        <JoinButtonEl
          href={`qw://${server.address}/`}
          className="flex items-center px-2"
        >
          Join as Player
        </JoinButtonEl>

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

        <ServersStreams server={server} />
      </div>
    </div>
  );
}
