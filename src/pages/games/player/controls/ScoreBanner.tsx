import classNames from "classnames";
import { useBoolean } from "usehooks-ts";
import { useFteController, useFteEvent } from "../../fte/hooks.ts";
import { Player } from "../../fte/types.ts";
import { useUpdateInterval } from "../../hooks.ts";
import { formatElapsed } from "../../time.ts";
import { QuakeTextFromBytes } from "../QuakeText.tsx";

export const ResponsiveScoreBanner = ({
  scale,
  showClock = true,
}: {
  scale: number;
  showClock?: boolean;
}) => {
  const { value: showscores, setTrue, setFalse } = useBoolean(false);
  useFteEvent("+showscores", setTrue);
  useFteEvent("-showscores", setFalse);

  return (
    <div
      className={classNames(
        "absolute left-0 right-0 mx-auto origin-top w-px top-[3%]",
        {
          hidden: showscores,
        },
      )}
      style={{ transform: `scale(${scale})` }}
    >
      <ScoreBanner showClock={showClock} />
    </div>
  );
};

export function ScoreBanner({ showClock = true }: { showClock?: boolean }) {
  return (
    <div className="flex flex-col items-center pointer-events-none select-none text-nowrap space-y-1">
      <Participants />
      {showClock && <GameClock />}
    </div>
  );
}

export function GameClock() {
  const fte = useFteController();
  useUpdateInterval(250);

  if (!fte || fte.getMatchElapsedTime() >= fte.getMatchDuration()) {
    return null;
  }

  return (
    <div className="text-center app-text-shadow font-bold text-yellow-200">
      {formatElapsed(fte.getMatchElapsedTime())}
    </div>
  );
}

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

type Participant = {
  name: number[];
  frags: number;
  topcolor: number;
  bottomcolor: number;
};

function playerToParticipant(player: Player): Participant {
  return {
    name: player.getName(),
    frags: player.frags,
    topcolor: player.topcolor,
    bottomcolor: player.bottomcolor,
  };
}
