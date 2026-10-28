import clsx from "clsx";
import { groupBy, pipe, sortBy, values } from "remeda";
import { QuakeText, quakeStringToHtml } from "@/components/ui/quake-text";
import type { Bot, Player, QuakeString, Team } from "@/lib/qworld/types";
import { ColoredFrags } from "./colored-frags";

type Participant = {
  name: QuakeString;
  frags: number;
  top_color: number;
  bottom_color: number;
  bot?: Bot | null;
};

const FFA_PLAYER_LIMIT = 10;

// compact scoreboard: teams side by side, 1on1 players side by side, otherwise a single list
export const SimpleScoreboard = ({
  players = [],
  teams = [],
  mode = "",
  gameMod = "",
}: {
  players?: Player[];
  teams?: Team[];
  mode?: string | null;
  gameMod?: string | null;
}) => {
  const excludeBots =
    (gameMod === "tot" || mode === "ffa") && players.some((p) => !p.bot);
  const players_ = excludeBots ? players.filter((p) => !p.bot) : players;

  return <Scores players={players_} teams={teams} mode={mode} />;
};

const Scores = ({
  players,
  teams,
  mode,
}: {
  players: Player[];
  teams: Team[];
  mode: string | null;
}) => {
  const showTeams = 2 === teams.length;
  let playerGroups: Player[][];
  let hiddenPlayerCount = 0;

  if (showTeams) {
    playerGroups = pipe(
      players,
      sortBy((p) => p.team.ascii),
      groupBy((p) => p.team.ascii),
      values(),
    );
  } else if ("1on1" === mode) {
    playerGroups = pipe(
      players,
      groupBy((p) => p.name.ascii),
      values(),
    );
  } else if ("ffa" === mode) {
    // top fraggers only. a single hidden player takes the same space as "+1 players"
    const limit =
      players.length > FFA_PLAYER_LIMIT + 1 ? FFA_PLAYER_LIMIT : players.length;
    playerGroups = [sortBy(players, [(p) => p.frags, "desc"]).slice(0, limit)];
    hiddenPlayerCount = players.length - limit;
  } else {
    playerGroups = [players];
  }

  const sortedTeams = sortBy(teams, (team) => team.name.ascii);
  const isTwoColumns = 2 === playerGroups.length;
  const isSingleList = 1 === playerGroups.length;

  return (
    <div
      className={clsx({
        "flex justify-center": isSingleList,
        "grid grid-cols-2 gap-x-1": isTwoColumns,
      })}
    >
      {showTeams && (
        <>
          <ParticipantCell participant={sortedTeams[0]} isEven={true} />
          <ParticipantCell participant={sortedTeams[1]} isEven={false} />
          <div className="col-span-2 mx-16 my-1.5 h-px bg-linear-to-r from-red-400/20 via-orange-400 to-red-400/20" />
        </>
      )}

      {playerGroups.map((group, index) => (
        <div key={group[0]?.name.unicode ?? index}>
          {group.map((player) => (
            <ParticipantCell
              key={`${player.user_id}-${player.name.unicode}`}
              participant={player}
              isEven={index % 2 === 0 && isTwoColumns}
            />
          ))}
          {hiddenPlayerCount > 0 && (
            <div className="mt-1 text-xs text-center text-slate-400">
              +{hiddenPlayerCount} players
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const ParticipantCell = ({
  participant,
  isEven,
}: {
  participant: Participant;
  isEven: boolean;
}) => {
  return (
    <div
      className="grid gap-x-2"
      style={{ gridTemplateColumns: isEven ? "1fr 36px" : "36px 1fr" }}
    >
      <div
        className={clsx({
          "text-amber-300/80": Boolean(participant.bot),
          "order-last": !isEven,
          "text-right": isEven,
        })}
      >
        <QuakeText
          tag="span"
          text={quakeStringToHtml(participant.name)}
          className="inline-flex max-w-30 truncate"
        />
      </div>
      <div className="my-px w-9 min-w-9 app-text-shadow">
        <ColoredFrags
          frags={participant.frags}
          colors={[participant.top_color, participant.bottom_color]}
        />
      </div>
    </div>
  );
};
