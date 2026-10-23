import clsx from "clsx";
import { ScoreboardLink } from "@/components/scoreboard/game-scoreboard";
import { btnSecondary } from "@/components/ui/theme";
import { Timestamp } from "@/components/ui/timestamp";
import { useDemoScoreSpoiler } from "@/features/demo-browser/hooks/use-demo-score-spoiler";
import { GameSearchEntry } from "@/lib/supabase/games";
import { DownloadButton, StatsButton } from "./controls";

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
            className={clsx(btnSecondary, "py-1 px-1.5 mx-auto", {
              "opacity-0": isVisible,
            })}
          >
            Show scores
          </button>
        </div>
        {game.demo_sha256 && (
          <div className="flex items-center gap-x-1 w-1/3 justify-end">
            {game.mode !== "wipeout" && (
              <StatsButton sha256={game.demo_sha256} />
            )}
            <DownloadButton sha256={game.demo_sha256} />
          </div>
        )}
      </div>
    </div>
  );
};
