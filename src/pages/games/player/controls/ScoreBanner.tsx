import classNames from "classnames";
import { useFteController } from "../../fte/hooks.ts";
// import { getPlayersMajorityColor } from "../../fte/util.ts";
import { useUpdateInterval } from "../../hooks.ts";
import { toColoredHtml } from "../../qwstrings.ts";
import { formatElapsed } from "../../time.ts";
import { Player } from "../../fte/types.ts";

type Participant = {
  name: number[];
  frags: number;
  topcolor: number;
  bottomcolor: number;
};

function playerToParticipant(player: Player): Participant {
  // const { top_color, bottom_color } = getPlayersMajorityColor(team.players);

  return {
    name: player.getName(),
    frags: player.frags,
    topcolor: player.topcolor,
    bottomcolor: player.bottomcolor,
  };
}

export const ScoreBanner = () => {
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

  if (participants.length < 2) {
    return null;
  }

  return (
    <div className="flex flex-col items-center app-effect-fade-in pointer-events-none select-none">
      <div className="origin-top scale-50 sm:scale-75 md:scale-100 lg:scale-100 xl:scale-125 3xl:scale-150">
        <div className="flex items-center">
          <Participant participant={participants[0]} index={0} />
          <Participant participant={participants[1]} index={1} />
        </div>
        <div className="text-center mt-1 text-base font-mono font-bold app-text-outline text-yellow-200">
          {formatElapsed(fte.getGameElapsedTime())}
        </div>
      </div>
    </div>
  );
};

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
          className={classNames("px-2 bg-black/50", {
            "rounded-l": isFirst,
            "rounded-r": !isFirst,
          })}
          dangerouslySetInnerHTML={{
            __html: toColoredHtml(String.fromCharCode(...participant.name)),
          }}
        />
      </div>
      <div
        className={classNames(
          `qw-bgcolor-${participant.topcolor}-${participant.bottomcolor} text-center w-12 text-lg font-bold app-text-outline border border-black`,
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
