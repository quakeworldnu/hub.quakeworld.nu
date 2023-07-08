import { Scoreboard } from "@/servers/Scoreboard";

export const LastscoresScoreboard = ({ lastscores }) => {
  const { teams = [], players = [] } = lastscores;
  let _players = [...players];

  if (teams.length > 0) {
    for (let i = 0; i < teams.length; i++) {
      _players = _players.concat(teams[i].players);
    }
  }

  _players.sort((a, b) => b.frags - a.frags);

  const server = {
    players: _players,
    teams,
    meta: {
      showTeams: teams.length > 0,
      showTeamColumn: teams.length > 0,
    },
  };

  return <Scoreboard server={server} />;
};
