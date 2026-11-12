import { ToggleGroup } from "@/components/ui/toggle-group";
import {
  serverListShowOptions,
  useServerListShow,
} from "@/features/servers/hooks/use-server-list-show";

export const ServerListShowBar = () => {
  const [show, setShow] = useServerListShow();

  return (
    <ToggleGroup
      value={show}
      onChange={setShow}
      options={serverListShowOptions.map((o) => ({
        ...o,
        title: `Show ${o.label.toLowerCase()} servers`,
      }))}
    />
  );
};
