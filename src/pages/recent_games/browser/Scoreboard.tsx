import { Demo, DemoParticipants } from "../services/supabase/supabase.types.ts";
import classNames from "classnames";
import { getMapshotCssUrl } from "../../../services/mapshots.ts";

// eslint-disable-next-line
// @ts-ignore
// @typescript-eslint/ban-ts-comment
import { Scoreboard as LegacyScoreboard } from "../../../servers/Scoreboard.jsx";

type ScoreboardProps = {
  demo: Demo;
  showScores?: boolean;
  showMapName?: boolean;
};

export const Scoreboard = ({
  demo,
  showScores = false,
  showMapName = false,
}: ScoreboardProps) => {
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
    <div className="h-full min-h-[160px] bg-cover bg-center bg-no-repeat bg-[url(https://hub.quakeworld.nu/assets/img/default_mapshot.jpg)] rounded">
      {isCustomMode && (
        <div className="absolute">
          <ModeRibbon mode={demo.mode} />
        </div>
      )}

      <div
        className={"h-full bg-no-repeat bg-center bg-cover rounded"}
        style={{
          backgroundImage: getMapshotCssUrl(demo.map),
        }}
      >
        <div className="flex flex-col h-full bg-gray-700/20 py-4">
          <div className="flex grow justify-center items-center">
            <LegacyScoreboard
              teams={fixedTeams}
              players={fixedPlayers}
              showFrags={showScores}
            />
          </div>
          {showMapName && (
            <div className="h-4 -mt-4 mr-3 self-end">
              <div className="bg-gray-900/70 px-1.5 py-0.5 rounded text-xs text-slate-300">
                {demo.map}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

type ScoreboardLinkProps = {
  demo: Demo;
  showScores?: boolean;
};

export const ScoreboardLink = ({
  demo,
  showScores = false,
}: ScoreboardLinkProps) => {
  return (
    <a
      title="Play demo"
      href={`/recent_games/?demoId=${demo.id}`}
      className={classNames(
        "hover:scale-105 transition-transform hover:z-20 hover:relative",
      )}
    >
      <Scoreboard demo={demo} showScores={showScores} showMapName />
    </a>
  );
};

const ModeRibbon = ({ mode }: { mode: string }) => {
  return (
    <div className="w-24 h-24 overflow-hidden">
      <div
        className={classNames(
          "flex -translate-x-[45%] -translate-y-[195%] -rotate-45 origin-bottom-right h-8 w-48 bg-gradient-to-bl justify-center items-center z-10 text-white app-text-shadow font-bold text-sm",
          {
            "from-amber-600 to-amber-900": mode === "ctf",
          },
        )}
      >
        {mode}
      </div>
    </div>
  );
};
