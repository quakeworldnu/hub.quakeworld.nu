import { MvdsvServer } from "@qwhub/pages/qtv/types.ts";
import { setSearchParam } from "@qwhub/pages/qtv/url.ts";

export function dispatchCustomEvent(
  eventName: string,
  detail: object | string = {},
) {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

export function selectServer(server: MvdsvServer) {
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
