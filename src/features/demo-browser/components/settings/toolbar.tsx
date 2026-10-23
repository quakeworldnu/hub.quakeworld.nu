import clsx from "clsx";
import { useGames } from "@/features/demo-browser/stores/games";
import { DisplayModeBar } from "./display-mode-bar";
import { GameModeBar } from "./game-mode-bar";
import { GlobalShowScoresToggle } from "./global-show-scores-toggle";
import { Hostname } from "./hostname";
import { MapName } from "./map-name";
import { Matchtag } from "./matchtag";
import { Pagination } from "./pagination";
import { PlayerQuery } from "./player-query";
import { QwleagueToggle } from "./qwleague-toggle";
import { Teams } from "./teams";
import { Timeframe } from "./timeframe";

export const Toolbar = () => {
  const { isLoading } = useGames();

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
      <PlayerQuery />
      <Teams />
      <MapName />
      <Matchtag />
      <Hostname />
      <Timeframe />
      <Pagination />
    </div>
  );
};
