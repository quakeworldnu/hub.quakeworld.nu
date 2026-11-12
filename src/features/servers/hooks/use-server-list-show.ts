import { useLocalStorage } from "usehooks-ts";
import type { ServerListShow } from "@/lib/qworld/api";

export const serverListShowOptions: { label: string; value: ServerListShow }[] =
  [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Empty", value: "empty" },
  ];

export function useServerListShow() {
  const [show, setShow] = useLocalStorage<ServerListShow>(
    "serversShow",
    "active",
  );
  const isValid = serverListShowOptions.some((o) => o.value === show);
  return [isValid ? show : "active", setShow] as const;
}
