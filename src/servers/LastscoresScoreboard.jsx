import { Scoreboard } from "@/servers/Scoreboard";
import { Mapshot } from "@/servers/Mapshot";

export const LastscoresScoreboard = ({ lastscores }) => {
  const { teams = [], players = [], map } = lastscores;
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

  return (
    <Mapshot map={map}>
      <div className="flex justify-center py-4 bg-gray-700/20">
        <Scoreboard server={server} />
      </div>
    </Mapshot>
  );
};
