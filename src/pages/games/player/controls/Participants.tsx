import { useFteController } from "@qwhub/pages/games/fte/hooks.ts";
import { Player } from "@qwhub/pages/games/fte/types.ts";
import { useUpdateInterval } from "@qwhub/pages/games/hooks.ts";
import { QuakeTextFromBytes } from "@qwhub/pages/games/player/QuakeText.tsx";
import classNames from "classnames";

export type Participant = {
  name: number[];
  frags: number;
  topcolor: number;
  bottomcolor: number;
};

export function Participants() {
  const fte = useFteController();
  useUpdateInterval(250);

  if (!fte) {
    return null;
  }

  let participants: Participant[];
  const state = fte.getClientState();

  if (state.teamplay > 0) {
    participants = fte.getTeams();
  } else {
    participants = fte.getPlayers().map(playerToParticipant);
  }

  if (participants.length !== 2) {
    return null;
  }

  return (
    <div className="flex items-center font-bold app-text-shadow">
      <Participant participant={participants[0]} index={0} />
      <Participant participant={participants[1]} index={1} />
    </div>
  );
}

function playerToParticipant(player: Player): Participant {
  return {
    name: player.getName(),
    frags: player.frags,
    topcolor: player.topcolor,
    bottomcolor: player.bottomcolor,
  };
}

const Participant = ({
  participant,
  index,
}: {
  participant: Participant;
  index: number;
}) => {
  const isFirst = index % 2 === 0;

  return (
    <div className={"flex w-48 justify-end last:flex-row-reverse"}>
      <div className="flex items-center">
        <div
          className={classNames("flex px-2 h-full items-center", {
            "rounded-l pl-2.5": isFirst,
            "rounded-r pr-2.5": !isFirst,
          })}
        >
          <QuakeTextFromBytes name={participant.name} />
        </div>
      </div>
      <div
        className={classNames(
          `qw-bgcolor-${participant.topcolor}-${participant.bottomcolor} w-12 max-w-12 text-center text-lg rounded`,
          {
            "border-r border-gray-800": isFirst,
          },
        )}
      >
        {participant.frags}
      </div>
    </div>
  );
};
