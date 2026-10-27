import { useEffect, useState } from "react";
import { selectServer } from "@/features/qtv/events";
import { useFteController } from "@/lib/fte/hooks";
import { useServers } from "@/lib/qworld/queries";
import { useQtvServers } from "@/lib/qworld/server-hooks";
import type { Server } from "@/lib/qworld/types";
import { getSearchParam } from "@/utils/search-params";

// server from ?address= (or the first qtv server), selected once fte is ready
export function useInitialQtvServer(): Server | null {
  const [server, setServer] = useState<Server | null>(null);
  const allServers = useServers();
  const servers = useQtvServers();
  const fte = useFteController();

  useEffect(() => {
    if (!servers || server) {
      return;
    }

    const address = getSearchParam("address");
    // ?address= may be a qtv server not in the sidebar list (e.g. no players)
    const selectedServer =
      allServers.find((s) => s.address === address && s.qtv_stream) ||
      servers[0];
    setServer(selectedServer);
  }, [servers]);

  useEffect(() => {
    if (server) {
      selectServer(server);
    }
  }, [server]);

  useEffect(() => {
    if (fte && server) {
      selectServer(server);
    }
  }, [fte]);

  return server;
}
