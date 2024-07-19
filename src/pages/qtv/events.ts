import { MvdsvServer } from "@qwhub/pages/qtv/types.ts";

function updateSearchParams(address: string) {
  const url = new URL(window.location.href);

  if (url.searchParams.get("address") === address) {
    return;
  }

  url.searchParams.set("address", address);
  history.pushState(null, "", url);
}

export function selectServer(server: MvdsvServer) {
  updateSearchParams(server.address);
  window.dispatchEvent(new CustomEvent("hub.selectServer", { detail: server }));
}
