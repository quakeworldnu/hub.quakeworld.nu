import { Scoreboard } from "@qwhub/servers/Scoreboard.tsx";
import type { Lastscores } from "@qwhub/services/qworld/lastscores.ts";

export const LastscoresScoreboard = ({
  lastscores,
}: {
  lastscores: Lastscores;
}) => {
  const { teams = [], players = [] } = lastscores;
  return <Scoreboard players={players} teams={teams} />;
};
