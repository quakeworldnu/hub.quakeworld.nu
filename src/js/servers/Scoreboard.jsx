import React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { coloredQuakeName, QuakeText } from "./QuakeText.jsx";
import { ColoredFrags } from "./ColoredFrags.jsx";

export const Scoreboard = (props) => {
  const { server, limit = 20 } = props;

  if (0 === server.player_slots.used || 0 === limit) {
    return null;
  }

  const showTeamColumn = "teamplay" in server.settings && server.settings.teamplay > 0;
  const showTeams = showTeamColumn && (server.teams.length < server.player_slots.used) && server.teams.length <= 3;

  let className = "scoreboard ";
  className += showTeamColumn ? "sc-show-team" : "sc-hide-team";

  const [parent] = useAutoAnimate();

  return (
    <div className={className} ref={parent}>
      {
        showTeams && (
          <>
            {server.teams.map(team => (
              <TeamRow
                {...team}
                key={`team-${team.name_color}-${team.name}`}
              />
            ))}

            <div className="my-1.5 h-0.5 bg-gradient-to-r from-red-400/20 via-orange-400 from-orange-400/20" />
          </>
        )
      }

      {server.players.map(player => (
        <PlayerRow
          {...player}
          showTeam={showTeamColumn}
          key={`player-${player.name_color}-${player.name}`}
        />
      ))}
    </div>
  );
};

const TeamRow = (props) => {
  const {
    name,
    name_color,
    frags,
    colors,
    ping,
  } = props;

  return (
    <div className="sc-row sc-row-team">
      <Ping value={`${ping} ms`} />
      <ColoredFrags frags={frags} colors={colors} />
      <QuakeText
        text={coloredQuakeName(name, name_color)}
        className="w-12 text-center"
      />
      <div />
    </div>
  )
}

const PlayerRow = (props) => {
  const {
    name,
    name_color,
    frags,
    colors,
    team,
    team_color,
    ping,
    is_bot,
    showTeam,
  } = props;

  let pingText = `${Math.min(666, ping)} ms`;
  if (ping > 0) {
    pingText = is_bot ? "(bot)" : `${Math.min(666, ping)} ms`;
  }

  let nameColumnClassNames = "truncate max-w-[160px]";

  if (is_bot) {
    nameColumnClassNames += "text-amber-300/80";
  }

  return (
    <div className="sc-row sc-row-player">
      <Ping value={pingText} />
      <ColoredFrags frags={frags} colors={colors} />
      {showTeam && (
        <QuakeText
          text={coloredQuakeName(team, team_color)}
          className="w-12 text-center"
        />
      )}
      <QuakeText
        text={coloredQuakeName(name, name_color)}
        className={nameColumnClassNames}
      />
    </div>
  );
};

const Ping = props => {
  const { value } = props;

  return (
    <span className="text-right text-xs opacity-50">{value}</span>
  )
}
