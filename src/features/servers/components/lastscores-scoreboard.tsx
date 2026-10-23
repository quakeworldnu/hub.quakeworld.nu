import { Scoreboard } from "@/components/scoreboard/scoreboard";
import type { Lastscores } from "@/lib/qworld/lastscores";

export const LastscoresScoreboard = ({
  lastscores,
}: {
  lastscores: Lastscores;
}) => {
  const { teams = [], players = [] } = lastscores;
  return <Scoreboard players={players} teams={teams} />;
};
