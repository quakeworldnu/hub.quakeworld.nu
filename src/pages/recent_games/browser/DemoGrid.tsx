import { useState } from "react";
import classNames from "classnames";
import {
  Demo,
  DemoParticipants,
  DemoPlayer,
  DemoTeam,
} from "../services/supabase/supabase.types.ts";
import { Timestamp } from "../Timestamp.tsx";
import { ToggleButton } from "../playlist/Playlist.tsx";
import { DownloadButton } from "./DemoList.tsx";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Scoreboard } from "../../../servers/Scoreboard.jsx";
import { QuakeText } from "../QuakeText.tsx";

export const DemoGrid = ({ demos }: { demos: Demo[] | null }) => {
  return (
    <div className="grid grid-cols-servers gap-4">
      {demos?.map((demo) => <GridItem key={demo.id} demo={demo} />)}
    </div>
  );
};

type GridItemDisplayMode = "teaser" | "scoreboard";

const GridItem = (props: { demo: Demo; mode?: GridItemDisplayMode }) => {
  const { demo, mode = "teaser" } = props;
  const [displayMode, setDisplayMode] = useState<GridItemDisplayMode>(mode);

  function revealScores() {
    setDisplayMode("scoreboard");
  }

  return (
    <div>
      {displayMode === "teaser" ? (
        <TeaserTile demo={demo} />
      ) : (
        <ScoreboardTile demo={demo} />
      )}

      <div className="flex items-center mt-1">
        <button
          onClick={revealScores}
          className={classNames("text-sm bg-slate-800 p-1 px-2 rounded", {
            "opacity-0": displayMode === "scoreboard",
          })}
        >
          Reveal scores
        </button>
        <div className="text-sm text-slate-400 text-center grow">
          <Timestamp timestamp={demo.timestamp} />{" "}
          <span className="text-slate-500">@</span> {demo.source.split(":")[0]}
        </div>
        <div className="flex items-center space-x-2 w-14">
          <ToggleButton demo={demo} />
          <DownloadButton s3_key={demo.s3_key} />
        </div>
      </div>
    </div>
  );
};

const ScoreboardTile = ({ demo }: { demo: Demo }) => {
  const { teams, players } = demo.participants as DemoParticipants;
  const hasTeams = teams.length > 0;

  if (hasTeams) {
    for (let i = 0; i < teams.length; i++) {
      teams[i].players.sort((a, b) => b.frags - a.frags);

      for (let j = 0; j < teams[i].players.length; j++) {
        teams[i].players[j].team = teams[i].name;
        teams[i].players[j].team_color = teams[i].name_color;
        players.push(teams[i].players[j]);
      }
    }
  }

  players.sort((a, b) => b.frags - a.frags);

  const server = {
    players,
    teams,
    meta: {
      showTeams: hasTeams,
      showTeamColumn: hasTeams,
    },
  };

  return (
    <a
      key={demo.id}
      title="Play demo"
      href={`/recent_games/?demoId=${demo.id}`}
      className={classNames(
        "flex flex-col border min-h-[200px] bg-slate-800 bg-no-repeat bg-center bg-cover hover:scale-105 transition-transform hover:shadow-2xl hover:z-20 hover:relative",
        {
          "border-green-800": demo.mode === "1on1",
          "border-blue-800": demo.mode === "2on2",
          "border-red-800": demo.mode === "4on4",
          "border-amber-700": demo.mode === "ctf",
        },
      )}
      style={{
        backgroundImage: `url(https://raw.githubusercontent.com/vikpe/qw-mapshots/main/${demo.map}.jpg)`,
      }}
    >
      <div className="absolute">
        <ModeRibbon mode={demo.mode} />
      </div>

      <div className="grow flex h-full bg-gray-700/20 justify-center items-center">
        <Scoreboard server={server} />
      </div>

      <div className="flex -mt-8 h-6 px-2 text-right ml-auto items-center bg-gray-900/50 text-xs rounded-lg mr-2 mb-2">
        {demo.map}
      </div>
    </a>
  );
};

const TeaserTile = ({ demo }: { demo: Demo }) => {
  return (
    <a
      key={demo.id}
      title="Play demo"
      href={`/recent_games/?demoId=${demo.id}`}
      className={classNames(
        "flex flex-col border min-h-[200px] bg-slate-800 bg-no-repeat bg-center bg-cover hover:scale-105 transition-transform hover:shadow-2xl hover:z-20 hover:relative",
        {
          "border-green-800": demo.mode === "1on1",
          "border-blue-800": demo.mode === "2on2",
          "border-red-800": demo.mode === "4on4",
          "border-amber-700": demo.mode === "ctf",
        },
      )}
      style={{
        backgroundImage: `url(https://raw.githubusercontent.com/vikpe/qw-mapshots/main/${demo.map}.jpg)`,
      }}
    >
      <div className="absolute">
        <ModeRibbon mode={demo.mode} />
      </div>

      <Participants participants={demo.participants as DemoParticipants} />

      <div className="flex -mt-8 h-6 px-2 text-right ml-auto items-center bg-gray-900/50 text-xs rounded-lg mr-2 mb-2">
        {demo.map}
      </div>
    </a>
  );
};

const Participants = ({ participants }: { participants: DemoParticipants }) => {
  const hasTeams = participants.teams.length > 0;
  const titles = hasTeams
    ? participants.teams.map((t: DemoTeam) => (
        <QuakeText text={t.name} color={t.name_color} />
      ))
    : participants.players.map((p: DemoPlayer) => (
        <QuakeText text={p.name} color={p.name_color} />
      ));

  return (
    <div className="grow flex h-full bg-gray-700/20 app-text-outline">
      <div className="w-1/2 flex flex-col justify-center">
        <div className="ml-auto">
          <div className="font-bold text-center text-2xl">{titles[0]}</div>
          {hasTeams && <PlayerList players={participants.teams[0].players} />}
        </div>
      </div>
      <div className="flex justify-center items-center w-16 app-text-shadow font-bold text-xl text-amber-300">
        VS
      </div>
      <div className="w-1/2 flex flex-col justify-center">
        <div className="mr-auto">
          <div className="font-bold text-center text-2xl">{titles[1]}</div>
          {hasTeams && <PlayerList players={participants.teams[1].players} />}
        </div>
      </div>
    </div>
  );
};

const PlayerList = ({ players }: { players: DemoPlayer[] }) => {
  return (
    <div className="text-center mx-1">
      {players.map((p) => (
        <div key={`${p.name}-${p.name_color}`}>
          <QuakeText text={p.name} color={p.name_color} />
        </div>
      ))}
    </div>
  );
};

export const ModeRibbon = ({ mode }: { mode: string }) => {
  return (
    <div className="w-24 h-24 overflow-hidden">
      <div
        className={classNames(
          "flex -translate-x-[45%] -translate-y-[195%] -rotate-45 origin-bottom-right h-8 w-48 bg-gradient-to-bl justify-center items-center z-10 text-white app-text-shadow font-bold text-sm",
          {
            "from-red-500 to-red-900": mode === "4on4",
            "from-blue-500 to-blue-900": mode === "2on2",
            "from-green-500 to-green-900": mode === "1on1",
            "from-amber-500 to-amber-900": mode === "ctf",
          },
        )}
      >
        {mode}
      </div>
    </div>
  );
};
