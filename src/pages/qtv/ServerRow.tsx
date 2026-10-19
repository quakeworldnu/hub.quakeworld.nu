import { useEventListener } from "@qwhub/pages/games/hooks";
import {
  qwleagueCountryCode,
  statusText,
  totalSpectatorCount,
} from "@qwhub/servers/util.ts";
import classNames from "classnames";
import { useBoolean } from "usehooks-ts";
import { Flag } from "./Flag";

import { QtvEvent } from "@qwhub/pages/qtv/events.ts";
import type { Server } from "@qwhub/services/qworld/types.ts";

export function ServerRow({
  server,
  onClick,
}: { server: Server; onClick: (server: Server) => void }) {
  const { value: isSelected, setValue: setIsSelected } = useBoolean(false);

  useEventListener(QtvEvent.SelectServer, ({ detail: selectedServer }) => {
    setIsSelected(selectedServer.address === server.address);
  });

  const title = server.meta.title.replace(` [${server.info.map}]`, "");
  const cc = qwleagueCountryCode(server.info.hostname) || server.meta.geo.cc;

  return (
    <div
      className={classNames(
        "py-3 px-2 flex flex-col cursor-pointer border-b border-b-[#334] hover:bg-[#242434] transition-colors",
        {
          "border-l-4 pl-3 border-sky-800 bg-[#1d1d2d]": isSelected,
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
          <Flag cc={cc} /> {title}{" "}
          {"ffa" === server.meta.mode && (
            <span className="text-xs text-slate-400">
              - <strong>{server.info.map}</strong> - {server.players.length}/
              {server.player_limit} players
            </span>
          )}
        </div>
        <div className="flex text-xs w-12 items-center justify-end">
          <div className="inline-block h-1.5 w-1.5 rounded-full bg-red-600 mr-1 mb-px" />
          {totalSpectatorCount(server)}
        </div>
      </div>
      {"ffa" !== server.meta.mode && (
        <div className="text-xs mt-1 text-slate-400">
          <strong>{server.info.map}</strong>: {statusText(server)}
        </div>
      )}
    </div>
  );
}
