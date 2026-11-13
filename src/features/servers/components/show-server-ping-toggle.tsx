import { Switch } from "@/components/ui/switch";
import { useShowServerPing } from "@/features/servers/hooks/use-show-server-ping";

export const ShowServerPingToggle = () => {
  const [showPing, setShowPing] = useShowServerPing();

  return (
    <div className="text-sm">
      <Switch
        label={"Show estimated ping"}
        title="Measured from your browser using WebRTC (STUN)"
        enabled={showPing}
        onClick={() => setShowPing(!showPing)}
      />
    </div>
  );
};
