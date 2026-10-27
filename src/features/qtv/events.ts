import type { Server } from "@/lib/qworld/types";
import { setSearchParam } from "@/utils/search-params";

declare global {
  interface WindowEventMap {
    [QtvEvent.SelectServer]: CustomEvent<Server>;
  }
}

export function selectServer(server: Server) {
  setSearchParam("address", server.address);
  window.dispatchEvent(
    new CustomEvent(QtvEvent.SelectServer, { detail: server }),
  );
}

export enum QtvEvent {
  SelectServer = "hub.qtv.SelectServer",
}
