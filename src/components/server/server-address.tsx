import React from "react";
import { qwleagueCountryCode } from "@/lib/qworld/server-utils";
import type { Server as ServerType } from "@/lib/qworld/types";
import { getFlagUrl } from "@/utils/flags";

export const ServerAddress = (props: { server: ServerType }) => {
  const { server } = props;
  const cc = qwleagueCountryCode(server.info.hostname) || server.meta.geo.cc;

  return (
    <div
      className="server-address flex items-center cursor-pointer text-gray-400"
      onClick={() => navigator.clipboard.writeText(server.meta.hostport)}
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
            className="inline h-3 w-auto mr-1.5 mb-px"
          />
        )}
        {title}
      </div>
    );
  },
);
