import { Scoreboard } from "@qwhub/servers/Scoreboard";

export const LastscoresScoreboard = ({ lastscores }) => {
  const { teams = [], players = [] } = lastscores;
  return <Scoreboard players={players} teams={teams} />;
};
