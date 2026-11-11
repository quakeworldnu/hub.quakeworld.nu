import { useLocalStorage } from "usehooks-ts";
import { isRadomskoHost } from "@/lib/qworld/radomsko";
import type { Server } from "@/lib/qworld/types";

export function useRadomskoFilter() {
  return useLocalStorage<boolean>("serversRadomsko", false);
}

export function isRadomskoServer(server: Server): boolean {
  return isRadomskoHost(server.info.hostname, server.meta.hostport);
}
