import { Switch } from "../../ui/Switch.tsx";
import { useGameSettings } from "./context.tsx";

const QWLEAGUE_HOSTNAME = "qwleague.com";

export const QwleagueToggle = () => {
  const { hostname, setHostname } = useGameSettings();
  const enabled = hostname === QWLEAGUE_HOSTNAME;

  function handleClick() {
    setHostname(enabled ? "" : QWLEAGUE_HOSTNAME);
  }

  return (
    <div className="text-sm">
      <Switch
        label={
          <img
            src="/assets/img/qwleague_logo.svg"
            alt="QWLeague"
            className="h-5 w-auto"
          />
        }
        title="Only show QWLeague games"
        enabled={enabled}
        onClick={handleClick}
      />
    </div>
  );
};
