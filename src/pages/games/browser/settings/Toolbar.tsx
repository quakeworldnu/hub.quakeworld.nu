import classNames from "classnames";
import { useGames } from "../context.tsx";
import { DisplayModeBar } from "./DisplayModeBar.tsx";
import { GameModeBar } from "./GameModeBar.tsx";
import { GlobalShowScoresToggle } from "./GlobalShowScoresToggle.tsx";
import { MapName } from "./MapName.tsx";
import { Pagination } from "./Pagination.tsx";
import { PlayerQuery } from "./PlayerQuery.tsx";
import { Teams } from "./Teams.tsx";

export const Toolbar = () => {
  const { isLoading } = useGames();

  return (
    <div
      className={classNames("flex flex-wrap gap-x-6 gap-y-3 items-center ", {
        "pointer-events-none": isLoading,
      })}
    >
      <DisplayModeBar />
      <GlobalShowScoresToggle />
      <GameModeBar />
      <PlayerQuery />
      <Teams />
      <MapName />
      <Pagination />
    </div>
  );
};
