import classNames from "classnames";
import { useDemos } from "../context.tsx";
import { DisplayModeBar } from "./DisplayModeBar.tsx";
import { GameModeBar } from "./GameModeBar.tsx";
import { GlobalShowScoresToggle } from "./GlobalShowScoresToggle.tsx";
import { Pagination } from "./Pagination.tsx";
import { SearchQuery } from "./SearchQuery.tsx";

export const Toolbar = () => {
  const { isLoading } = useDemos();

  return (
    <div
      className={classNames("flex flex-wrap gap-x-6 gap-y-3 items-center ", {
        "pointer-events-none": isLoading,
      })}
    >
      <DisplayModeBar />
      <GlobalShowScoresToggle />
      <GameModeBar />
      <SearchQuery />
      <Pagination />
      {/*<BulkActions />*/}
    </div>
  );
};
