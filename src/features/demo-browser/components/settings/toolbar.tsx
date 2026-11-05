import {
  faGlobe,
  faServer,
  faTag,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { useGameSettings } from "@/features/demo-browser/providers/browser-settings";
import { useGames } from "@/features/demo-browser/providers/games";
import { DisplayModeBar } from "./display-mode-bar";
import { GameModeBar } from "./game-mode-bar";
import { GlobalShowScoresToggle } from "./global-show-scores-toggle";
import { Pagination } from "./pagination";
import { QwleagueToggle } from "./qwleague-toggle";
import { normalizeLowerTrim, SearchInput } from "./search-input";
import { Timeframe } from "./timeframe";

export const Toolbar = () => {
  const { isLoading } = useGames();
  const settings = useGameSettings();

  return (
    <div
      className={clsx("flex flex-wrap gap-x-6 gap-y-3 items-center ", {
        "pointer-events-none": isLoading,
      })}
    >
      <DisplayModeBar />
      <GlobalShowScoresToggle />
      <GameModeBar />
      <QwleagueToggle />
      <SearchInput
        icon={faUser}
        title="Player(s), separate with space"
        className="w-44"
        value={settings.playerQuery}
        onChange={settings.setPlayerQuery}
        autoFocus
      />
      <SearchInput
        icon={faUsers}
        title="Team(s), separate with space"
        className="w-32"
        value={settings.teams}
        onChange={settings.setTeams}
      />
      <SearchInput
        icon={faGlobe}
        title="Map"
        className="w-28"
        value={settings.map}
        onChange={settings.setMap}
        normalize={normalizeLowerTrim}
      />
      <SearchInput
        icon={faTag}
        title="Matchtag"
        className="w-24"
        value={settings.matchtag}
        onChange={settings.setMatchtag}
        normalize={normalizeLowerTrim}
      />
      <SearchInput
        icon={faServer}
        title="Server hostname"
        className="w-32"
        value={settings.hostname}
        onChange={settings.setHostname}
        normalize={normalizeLowerTrim}
      />
      <Timeframe />
      <Pagination />
    </div>
  );
};
