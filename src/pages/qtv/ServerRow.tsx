import { useEventListener } from "@qwhub/pages/games/hooks";
import { totalSpectatorCount } from "@qwhub/servers/util.ts";
import classNames from "classnames";
import { useBoolean } from "usehooks-ts";
import { Flag } from "./Flag";

import { MvdsvServer } from "@qwhub/pages/qtv/types.ts";

export function ServerRow({
  server,
  onClick,
}: { server: MvdsvServer; onClick: (server: MvdsvServer) => void }) {
  const { value: isSelected, setValue: setIsSelected } = useBoolean(false);

  useEventListener("hub.selectServer", ({ detail: selectedServer }) => {
    setIsSelected(selectedServer.address === server.address);
  });

  return (
    <div
      className={classNames(
        "p-3 flex flex-col cursor-pointer border-b border-b-[#334] hover:bg-white/10",
        {
          "border-l-4 pl-4 border-sky-800 bg-white/5": isSelected,
        },
      )}
      onClick={() => onClick(server)}
    >
      <div className="flex justify-between items-center">
        <div
          className={classNames("text-sm", {
            "font-bold": isSelected,
          })}
        >
          <Flag cc={server.geo.cc} /> {server.title}{" "}
          {"ffa" === server.mode && (
            <span className="text-xs text-slate-400">
              - {server.player_slots.used}/{server.player_slots.total} players
            </span>
          )}
        </div>
        <div className="flex text-xs w-12 items-center justify-end">
          <div className="inline-block h-1.5 w-1.5 rounded-full bg-red-600 mr-1" />
          {totalSpectatorCount(server)}
        </div>
      </div>
      {"ffa" !== server.mode && (
        <div className="text-xs mt-1 text-slate-400">
          {server.status.name} - {server.status.description}
        </div>
      )}
    </div>
  );
}
