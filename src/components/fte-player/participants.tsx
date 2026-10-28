import clsx from "clsx";
import { QuakeTextFromBytes } from "@/components/ui/quake-text-bytes";
import { usePolledValue } from "@/hooks/use-polled-value";
import { useFteController } from "@/lib/fte/hooks";
import type { Participants as FteParticipants } from "@/lib/fte/types";

type Side = {
  name_bytes: Uint8Array;
  frags: number;
  top_color: number;
  bottom_color: number;
};

// two sides: teams, else a 1on1
export function Participants() {
  const fte = useFteController();
  const sides = usePolledValue(
    () => (fte ? getSides(fte.getParticipants()) : []),
    fte ? 250 : null,
    (value) =>
      value
        .map(
          (s) => `${s.name_bytes}:${s.frags}:${s.top_color}:${s.bottom_color}`,
        )
        .join("|"),
  );

  if (sides.length !== 2) {
    return null;
  }

  return (
    <div className="flex items-center font-bold app-text-shadow">
      <Participant participant={sides[0]} index={0} />
      <Participant participant={sides[1]} index={1} />
    </div>
  );
}

function getSides({ players, teams }: FteParticipants): Side[] {
  return teams.length === 2 ? teams : players.length === 2 ? players : [];
}

const Participant = ({
  participant,
  index,
}: {
  participant: Side;
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
          <QuakeTextFromBytes name={participant.name_bytes} />
        </div>
      </div>
      <div
        className={clsx(
          `qw-bgcolor qw-bgcolor-top-${participant.top_color} qw-bgcolor-bottom-${participant.bottom_color} w-12 max-w-12 text-center text-lg rounded`,
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
