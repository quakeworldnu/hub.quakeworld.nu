import classNames from "classnames";
import { useFteController } from "../../fte/hooks.ts";
import { useUpdateInterval } from "../../hooks.ts";
import { PlayerInfo, TeamInfo } from "../../fte/types.ts";
import { toColoredHtml } from "../../qwstrings.ts";
import { formatElapsed } from "../../time.ts";

type ParticipantInfo = {
  name: string;
  frags: number;
  top_color: number;
  bottom_color: number;
};

function getMajorityColorPair(players: PlayerInfo[]): number[] {
  if (players.length === 0) {
    return [0, 0];
  } else if (players.length === 1) {
    return [players[0].top_color, players[0].bottom_color];
  }

  const colorPairs = players.map(
    (p: PlayerInfo) => `${p.top_color}-${p.bottom_color}`,
  );
  colorPairs.sort();

  const countPerPair: { [key: string]: number } = {};

  for (const element of colorPairs) {
    if (countPerPair[element]) {
      countPerPair[element] += 1;
    } else {
      countPerPair[element] = 1;
    }
  }

  const majorityColorPair = Object.keys(countPerPair).reduce((a, b) =>
    countPerPair[a] > countPerPair[b] ? a : b,
  );

  return majorityColorPair.split("-").map((x) => parseInt(x, 10));
}

function teamToParticipant(team: TeamInfo): ParticipantInfo {
  const [top_color, bottom_color] = getMajorityColorPair(team.players);

  return {
    name: team.name,
    frags: team.frags,
    top_color,
    bottom_color,
  };
}

export const ScoreBanner = ({ isTeamplay }: { isTeamplay: boolean }) => {
  const fte = useFteController();
  useUpdateInterval(500);

  if (!fte) {
    return null;
  }

  let participants: ParticipantInfo[];

  if (isTeamplay) {
    participants = fte.getTeams().map(teamToParticipant);
  } else {
    participants = fte.getPlayers();
  }

  if (participants.length < 2) {
    return null;
  }

  const maxNameLength = Math.max(...participants.map((p) => p.name.length));

  return (
    <div className="w-fit mx-auto app-effect-fade-in origin-top scale-50 sm:scale-75 md:scale-100 lg:scale-100 xl:scale-125 3xl:scale-150 pointer-events-none select-none">
      <div className="flex items-center justify-between">
        <Participant
          participant={participants[0]}
          index={0}
          nameLength={maxNameLength}
        />
        <Participant
          participant={participants[1]}
          index={1}
          nameLength={maxNameLength}
        />
      </div>
      <div className="text-center mt-1 text-base font-mono font-bold app-text-outline text-yellow-200">
        {formatElapsed(fte.getGameElapsedTime())}
      </div>
    </div>
  );
};

const Participant = ({
  participant,
  index,
  nameLength,
}: {
  participant: ParticipantInfo;
  index: number;
  nameLength: number;
}) => {
  const padCount = nameLength - participant.name.length;
  const isFirst = index % 2 === 0;

  return (
    <div
      className={classNames("flex items-center", {
        "flex-row-reverse": !isFirst,
      })}
    >
      <div
        className={classNames("flex items-center bg-black/50", {
          "rounded-r": !isFirst,
          "rounded-l": isFirst,
        })}
      >
        {padCount > 0 && (
          <div className="text-transparent">{"j".repeat(padCount)}</div>
        )}
        <div
          className={classNames("px-4", {
            "text-right": index % 2 === 1,
          })}
          dangerouslySetInnerHTML={{ __html: toColoredHtml(participant.name) }}
        />
      </div>
      <div
        className={classNames(
          `qw-bgcolor-${participant.top_color}-${participant.bottom_color} text-center w-12 text-lg font-bold app-text-outline border border-black`,
          {
            "border-r-0": isFirst,
          },
        )}
      >
        {participant.frags}
      </div>
    </div>
  );
};
