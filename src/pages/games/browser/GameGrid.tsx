import classNames from "classnames";
import { Timestamp } from "../Timestamp.tsx";
import { GameSearchEntry } from "../services/supabase/supabase.ts";
import { btnSecondary } from "../ui/theme.ts";
import { DownloadButton } from "./Controls.tsx";
import { ScoreboardLink } from "./Scoreboard.tsx";
import { useDemoScoreSpoiler } from "./hooks.ts";

export const GameGrid = ({ games }: { games: GameSearchEntry[] }) => {
  return (
    <div className="grid grid-cols-servers gap-4">
      {games.map((game: GameSearchEntry) => (
        <GridItem key={game.id} game={game} />
      ))}
    </div>
  );
};

const GridItem = (props: { game: GameSearchEntry }) => {
  const { game } = props;
  const { isVisible, show } = useDemoScoreSpoiler();

  return (
    <div className="flex flex-col h-full">
      <ScoreboardLink game={game} showScores={isVisible} />

      <div className="flex items-center mt-1 text-xs justify-between">
        <div className="w-1/3 text-slate-500">
          <Timestamp timestamp={game.timestamp} />
        </div>
        <div className="w-1/3">
          <button
            onClick={show}
            className={classNames(btnSecondary, "py-1 px-1.5 mx-auto", {
              "opacity-0": isVisible,
            })}
          >
            Show scores
          </button>
        </div>
        {game.demo_sha256 && (
          <div className="flex items-center space-x-1 w-1/3 justify-end">
            <DownloadButton sha256={game.demo_sha256} />
          </div>
        )}
      </div>
    </div>
  );
};
