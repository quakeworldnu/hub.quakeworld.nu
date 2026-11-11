import { Switch } from "@/components/ui/switch";
import { useGameSettings } from "@/features/demo-browser/providers/browser-settings";
import { RADOMSKO_HOST_PREFIX as RADOMSKO_HOSTNAME } from "@/lib/qworld/radomsko";
import { getFlagUrl } from "@/utils/flags";

export const RadomskoToggle = () => {
  const { hostname, setHostname } = useGameSettings();
  const enabled = hostname === RADOMSKO_HOSTNAME;

  function handleClick() {
    setHostname(enabled ? "" : RADOMSKO_HOSTNAME);
  }

  return (
    <div className="text-sm">
      <Switch
        label={
          <span className="flex items-center">
            <img
              src={getFlagUrl("pl")}
              alt="PL"
              className="inline h-3 w-auto mr-1.5"
            />
            Radomsko
          </span>
        }
        title="Only show games from the Radomsko LAN (play.qwlan.pl)"
        enabled={enabled}
        onClick={handleClick}
      />
    </div>
  );
};
