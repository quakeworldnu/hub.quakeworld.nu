import { useMemo } from "react";
import {
  isRadomskoServer,
  useRadomskoFilter,
} from "@/features/servers/hooks/use-radomsko-filter";
import { useServerListShow } from "@/features/servers/hooks/use-server-list-show";
import { useServerPresentation } from "@/features/servers/hooks/use-server-presentation";
import { useServers } from "@/lib/qworld/queries";
import { useFilteredServers } from "@/lib/qworld/server-hooks";
import { searchServers } from "@/lib/qworld/server-search";
import { useServerSearch } from "@/stores/settings";
import { ClientList } from "./client-list";
import { Server } from "./server";
import { ServerList } from "./server-list";
import { ServerPreviewPortal, useServerPreview } from "./server-preview";

export default function Servers() {
  const [show] = useServerListShow();
  const [presentation] = useServerPresentation();
  const preview = useServerPreview();
  // "active" is polled by <ServerPoller />, other lists poll their own query
  useServers(
    "active" === show ? undefined : { interval: 5000, refetchOnFocus: true },
    show,
  );
  const filteredServers = useFilteredServers(show);
  const [onlyRadomsko] = useRadomskoFilter();
  const search = useServerSearch();
  const servers = useMemo(() => {
    const result = onlyRadomsko
      ? filteredServers.filter(isRadomskoServer)
      : filteredServers;
    return searchServers(result, search);
  }, [filteredServers, onlyRadomsko, search]);

  if ("list" === presentation) {
    return (
      <div className="mb-6 flex flex-col xl:flex-row gap-6 items-start">
        <div className="w-full xl:w-auto xl:flex-1 min-w-0">
          <ServerList servers={servers} preview={preview} />
        </div>
        <div className="hidden xl:block shrink-0 min-w-[240px] max-w-[33%]">
          <ClientList servers={servers} preview={preview} />
        </div>
        <ServerPreviewPortal preview={preview} servers={servers} />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="server-list grid grid-cols-servers gap-4 md:gap-6">
        {servers.map((server) => (
          <Server key={server.address} server={server} />
        ))}
      </div>
    </div>
  );
}

export function ServerPoller({ pollingInterval = 5 }) {
  // pause while page is hidden, refresh immediately when visible again
  useServers({ interval: pollingInterval * 1000, refetchOnFocus: true });
  return null;
}
