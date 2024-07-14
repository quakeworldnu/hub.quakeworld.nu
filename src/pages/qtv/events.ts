import { MvdsvServer } from "@qwhub/pages/qtv/types.ts";

export function selectServer(server: MvdsvServer) {
  window.dispatchEvent(new CustomEvent("hub.selectServer", { detail: server }));
}
