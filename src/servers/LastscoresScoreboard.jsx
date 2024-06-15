import { Scoreboard } from "@qwhub/servers/Scoreboard";

export const LastscoresScoreboard = ({ lastscores }) => {
  const { teams = [], players = [] } = lastscores;
  let _players = [...players];

  if (teams.length > 0) {
    for (let i = 0; i < teams.length; i++) {
      _players = _players.concat(teams[i].players);
    }
  }

  return <Scoreboard players={_players} teams={teams} />;
};
