import { Matchtag, QWLeagueBanner } from "@qwhub/servers/Server.tsx";
import { isQwleagueHostname } from "@qwhub/servers/util.ts";
import clsx from "clsx";
import { Scoreboard as LegacyScoreboard } from "../../../servers/Scoreboard.tsx";
import { getMapshotCssUrl } from "../../../services/mapshots.ts";
import { GameSearchEntry } from "../services/supabase/supabase.ts";
import type {
  GamePlayer,
  GameTeam,
} from "../services/supabase/supabase.types.ts";

type ScoreboardProps = {
  game: GameSearchEntry;
  showScores?: boolean;
  showMapName?: boolean;
};

export const Scoreboard = ({
  game,
  showScores = false,
  showMapName = false,
}: ScoreboardProps) => {
  // teams/players are json columns
  const fixedTeams = [...(game.teams as GameTeam[])].map((v) => ({
    colors: v.color,
    ...v,
  }));
  const fixedPlayers = [...(game.players as GamePlayer[])].map((v) => ({
    colors: v.color,
    ...v,
  }));
  const isCustomMode = ["ctf", "wipeout"].includes(game.mode);
  const isQwleague = isQwleagueHostname(game.server_hostname);

  return (
    <div className="h-full bg-cover bg-center bg-no-repeat bg-[url(https://a.quake.world/mapshots/default.jpg)]">
      {isCustomMode && (
        <div className="absolute">
          <ModeRibbon mode={game.mode} />
        </div>
      )}

      <div
        className={"h-full bg-no-repeat bg-center bg-cover"}
        style={{
          backgroundImage: getMapshotCssUrl(game.map),
        }}
      >
        <div className="flex flex-col h-full bg-gray-700/20">
          {isQwleague && (
            <QWLeagueBanner
              matchtag={game.matchtag}
              hostname={game.server_hostname}
            />
          )}
          <div className="flex flex-col grow py-4">
            <div className="flex flex-col grow justify-center items-center min-h-20 md:min-h-[160px]">
              {!isQwleague && <Matchtag text={game.matchtag} />}
              <LegacyScoreboard
                teams={fixedTeams}
                players={fixedPlayers}
                showFrags={showScores}
              />
            </div>
            {showMapName && (
              <div className="h-4 -mt-4 mr-3 self-end">
                <div className="bg-gray-900/70 px-1.5 py-0.5 rounded text-xs text-slate-300">
                  {game.map}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

type ScoreboardLinkProps = {
  game: GameSearchEntry;
  showScores?: boolean;
};

export const ScoreboardLink = ({
  game,
  showScores = false,
}: ScoreboardLinkProps) => {
  // the card link is an overlay instead of a wrapper, links can't be nested
  // (the qwleague banner has its own link, raised above the overlay)
  return (
    <div className="relative h-full hover:scale-105 transition-transform hover:z-20">
      <Scoreboard game={game} showScores={showScores} showMapName />
      <a
        title="Play demo"
        href={`/games/?gameId=${game.id}`}
        className="absolute inset-0"
      >
        <span className="sr-only">Play demo</span>
      </a>
    </div>
  );
};

const ModeRibbon = ({ mode }: { mode: string }) => {
  return (
    <div className="w-24 h-24 overflow-hidden">
      <div
        className={clsx(
          "flex translate-x-[-45%] translate-y-[-195%] -rotate-45 origin-bottom-right h-8 w-48 bg-linear-to-bl justify-center items-center z-10 text-white app-text-shadow font-bold text-sm",
          {
            "from-amber-600 to-amber-900": mode === "ctf",
            "from-sky-600 to-sky-900": mode === "wipeout",
          },
        )}
      >
        {mode}
      </div>
    </div>
  );
};
