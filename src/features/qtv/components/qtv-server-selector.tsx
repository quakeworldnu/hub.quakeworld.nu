import clsx from "clsx";
import { useBoolean, useEventListener } from "usehooks-ts";
import { Mapshot } from "@/components/scoreboard/mapshot";
import { Scoreboard } from "@/components/scoreboard/scoreboard";
import {
  hideQtvServerSelector,
  QtvEvent,
  selectServer,
  showQtvServerSelector,
} from "@/features/qtv/events";
import { useQtvServers } from "@/lib/qworld/server-hooks";
import { scoreboardPlayers, scoreboardTeams } from "@/lib/qworld/server-utils";
import type { Server } from "@/lib/qworld/types";

export function QtvServerSelectorOverlay({
  defaultVisible = true,
}: {
  defaultVisible?: boolean;
}) {
  const {
    value: isVisible,
    setFalse: hide,
    setTrue: show,
  } = useBoolean(defaultVisible);
  useEventListener(QtvEvent.SelectServer, hideQtvServerSelector);
  useEventListener(QtvEvent.HideServerSelector, hide);
  useEventListener(QtvEvent.ShowServerSelector, show);

  useEventListener(QtvEvent.ToggleServerSelector, () => {
    if (isVisible) {
      hideQtvServerSelector();
    } else {
      showQtvServerSelector();
    }
  });

  return (
    <div
      className={clsx(
        "absolute z-10 grid items-center w-full h-full transition-opacity duration-500 backdrop-blur-sm overflow-auto p-4",
        {
          "opacity-0 pointer-events-none": !isVisible,
        },
      )}
      onClick={() => hideQtvServerSelector()}
    >
      <QtvServerSelector />
    </div>
  );
}

export function QtvServerSelector() {
  const servers: Server[] = useQtvServers();

  return (
    <div className="grid grid-cols-servers">
      {0 === servers.length && (
        <div className="py-4 text-center">no active servers available</div>
      )}

      {servers.map((server, index) => (
        <div
          key={[server.address, index].join("-")}
          onClick={() => selectServer(server)}
          className="cursor-pointer border-2 border-slate-900 hover:border-sky-600 shadow-sm hover:contrast-125"
        >
          <Mapshot map={server.info.map}>
            <div className="flex flex-col h-full bg-gray-700/20 py-4">
              <div className="flex grow justify-center items-center min-h-[160px]">
                <Scoreboard
                  teams={scoreboardTeams(server)}
                  players={scoreboardPlayers(server)}
                  showFrags={true}
                />
              </div>
              <div className="h-4 -mt-4 mr-3 self-end">
                <div className="bg-gray-900/70 px-1.5 py-0.5 rounded text-xs text-slate-300">
                  {server.info.map}
                </div>
              </div>
            </div>
          </Mapshot>
        </div>
      ))}
    </div>
  );
}
