import classNames from "classnames";
import { Demo } from "../services/supabase/supabase.types.ts";
import { Timestamp } from "../Timestamp.tsx";
import { ToggleButton } from "../playlist/Playlist.tsx";
import { btnSecondary } from "../ui/theme.ts";
import { useDemoScoreSpoiler } from "./hooks.ts";
import { DownloadButton } from "./Controls.tsx";
import { ScoreboardLink } from "./Scoreboard.tsx";

export const DemoGrid = ({ demos }: { demos: Demo[] | null }) => {
  return (
    <div className="grid grid-cols-servers gap-4">
      {demos?.map((demo) => <GridItem key={demo.id} demo={demo} />)}
    </div>
  );
};

const GridItem = (props: { demo: Demo }) => {
  const { demo } = props;
  const { isVisible, show } = useDemoScoreSpoiler();

  return (
    <div className="flex flex-col h-full">
      <ScoreboardLink demo={demo} showScores={isVisible} />

      <div className="flex items-center mt-1 text-xs">
        <button
          onClick={show}
          className={classNames(btnSecondary, "py-1 px-1.5", {
            "opacity-0": isVisible,
          })}
        >
          Show scores
        </button>
        <div className="text-slate-400 grow text-center">
          <Timestamp timestamp={demo.timestamp} />{" "}
          <span className="text-slate-500">@</span> {demo.source}
        </div>
        <div className="flex items-center space-x-1">
          <ToggleButton demo={demo} />
          <DownloadButton s3_key={demo.s3_key} />
        </div>
      </div>
    </div>
  );
};
