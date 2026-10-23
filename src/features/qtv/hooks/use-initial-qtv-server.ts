import { useEffect, useState } from "react";
import { selectServer } from "@/features/qtv/events";
import { useFteController } from "@/lib/fte/hooks";
import { useQtvServers } from "@/lib/qworld/server-hooks";
import type { Server } from "@/lib/qworld/types";
import { getSearchParam } from "@/utils/search-params";

// server from ?address= (or the first qtv server), selected once fte is ready
export function useInitialQtvServer(): Server | null {
  const [server, setServer] = useState<Server | null>(null);
  const servers = useQtvServers();
  const fte = useFteController();

  useEffect(() => {
    if (!servers || server) {
      return;
    }

    const address = getSearchParam("address");
    const selectedServer =
      servers.find((s) => s.address === address) || servers[0];
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
