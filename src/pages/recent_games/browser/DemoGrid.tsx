import classNames from "classnames";
import { Demo, DemoParticipants } from "../services/supabase/supabase.types.ts";
import { Timestamp } from "../Timestamp.tsx";
import { ToggleButton } from "../playlist/Playlist.tsx";
import { btnSecondary } from "../ui/theme.ts";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Scoreboard } from "../../../servers/Scoreboard.jsx";
import { useDemoScoreSpoiler } from "./hooks.ts";
import { DownloadButton } from "./Controls.tsx";

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
      <div className="h-full min-h-[200px]">
        <ScoreboardTile demo={demo} showScores={isVisible} />
      </div>

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

const ScoreboardTile = ({
  demo,
  showScores = false,
}: {
  demo: Demo;
  showScores: boolean;
}) => {
  const { teams, players } = demo.participants as DemoParticipants;
  const hasTeams = teams.length > 0;

  const fixedTeams = [...teams];
  const fixedPlayers = [...players];

  if (hasTeams) {
    for (let i = 0; i < fixedTeams.length; i++) {
      for (let j = 0; j < fixedTeams[i].players.length; j++) {
        fixedTeams[i].players[j].colors = fixedTeams[i].colors;
        fixedTeams[i].players[j].team = fixedTeams[i].name;
        fixedTeams[i].players[j].team_color = fixedTeams[i].name_color;
        fixedPlayers.push(fixedTeams[i].players[j]);
      }
    }
  }

  if (showScores) {
    fixedTeams.sort((a, b) => b.frags - a.frags);
    fixedPlayers.sort((a, b) => b.frags - a.frags);
  }

  const isCustomMode = ["ctf"].includes(demo.mode);

  return (
    <a
      key={demo.id}
      title="Play demo"
      href={`/recent_games/?demoId=${demo.id}`}
      className={classNames(
        "flex flex-col border border-black h-full bg-slate-800 bg-no-repeat bg-center bg-cover hover:scale-105 transition-transform hover:z-20 hover:relative",
        {
          "zborder-green-800": demo.mode === "1on1",
          "zborder-blue-800": demo.mode === "2on2",
          "zborder-red-800": demo.mode === "4on4",
          "zborder-amber-700": demo.mode === "ctf",
        },
      )}
      style={{
        backgroundImage: `url(https://raw.githubusercontent.com/vikpe/qw-mapshots/main/${demo.map}.jpg)`,
      }}
    >
      <div className="flex flex-col h-full bg-gray-700/20">
        {isCustomMode && (
          <div className="absolute">
            <ModeRibbon mode={demo.mode} />
          </div>
        )}

        <div className="flex grow justify-center items-center py-4 -mb-8">
          <Scoreboard
            teams={fixedTeams}
            players={fixedPlayers}
            showFrags={showScores}
          />
        </div>
        <div className="flex h-8 px-2 items-start justify-end text-xs text-slate-300">
          <div className="bg-gray-900/50 rounded px-2 py-1">{demo.map}</div>
        </div>
      </div>
    </a>
  );
};

export const ModeRibbon = ({ mode }: { mode: string }) => {
  return (
    <div className="w-24 h-24 overflow-hidden">
      <div
        className={classNames(
          "flex -translate-x-[45%] -translate-y-[195%] -rotate-45 origin-bottom-right h-8 w-48 bg-gradient-to-bl justify-center items-center z-10 text-white app-text-shadow font-bold text-sm",
          {
            "from-red-600 to-red-900": mode === "4on4",
            "from-blue-600 to-blue-900": mode === "2on2",
            "from-green-600 to-green-900": mode === "1on1",
            "from-amber-600 to-amber-900": mode === "ctf",
          },
        )}
      >
        {mode}
      </div>
    </div>
  );
};
