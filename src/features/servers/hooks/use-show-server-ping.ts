import { useLocalStorage } from "usehooks-ts";

// off by default: the ping is measured with webrtc (stun), which can expose
// the addresses of local network interfaces, a privacy concern for some
export function useShowServerPing() {
  return useLocalStorage<boolean>("serversShowPing", false);
}
