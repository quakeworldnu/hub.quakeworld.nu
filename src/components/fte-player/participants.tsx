import clsx from "clsx";
import { QuakeTextFromBytes } from "@/components/ui/quake-text-bytes";
import { useUpdateInterval } from "@/hooks/use-update-interval";
import { useFteController } from "@/lib/fte/hooks";
import type { Player } from "@/lib/fte/types";

export type Participant = {
  name: Uint8Array;
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
          className={clsx("flex px-2 h-full items-center", {
            "rounded-l pl-2.5": isFirst,
            "rounded-r pr-2.5": !isFirst,
          })}
        >
          <QuakeTextFromBytes name={participant.name} />
        </div>
      </div>
      <div
        className={clsx(
          `qw-bgcolor qw-bgcolor-top-${participant.topcolor} qw-bgcolor-bottom-${participant.bottomcolor} w-12 max-w-12 text-center text-lg rounded`,
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
