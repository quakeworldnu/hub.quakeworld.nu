import type { Server } from "@/lib/qworld/types";
import { setSearchParam } from "@/utils/search-params";

declare global {
  interface WindowEventMap {
    [QtvEvent.SelectServer]: CustomEvent<Server>;
    [QtvEvent.ShowServerSelector]: Event;
    [QtvEvent.HideServerSelector]: Event;
    [QtvEvent.ToggleServerSelector]: Event;
  }
}

function dispatchCustomEvent(eventName: QtvEvent, detail?: Server) {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

export function selectServer(server: Server) {
  setSearchParam("address", server.address);
  dispatchCustomEvent(QtvEvent.SelectServer, server);
}

export function showQtvServerSelector() {
  dispatchCustomEvent(QtvEvent.ShowServerSelector);
}
export function hideQtvServerSelector() {
  dispatchCustomEvent(QtvEvent.HideServerSelector);
}
export function toggleQtvServerSelector() {
  dispatchCustomEvent(QtvEvent.ToggleServerSelector);
}

export enum QtvEvent {
  SelectServer = "hub.qtv.SelectServer",
  ShowServerSelector = "hub.qtv.server_selector.show",
  HideServerSelector = "hub.qtv.server_selector.hide",
  ToggleServerSelector = "hub.qtv.server_selector.toggle",
}
