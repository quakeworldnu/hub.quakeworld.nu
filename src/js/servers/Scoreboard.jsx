import React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { coloredQuakeName, QuakeText } from "./QuakeText.jsx";
import { ColoredFrags } from "./ColoredFrags.jsx";

export const Scoreboard = (props) => {
  const { server, limit = 20 } = props;

  if (0 === server.player_slots.used || 0 === limit) {
    return null;
  }

  const showTeams = "teamplay" in server.settings && server.settings.teamplay > 0;

  let className = "scoreboard ";
  className += showTeams ? "sc-show-team" : "sc-hide-team";

  const [parent] = useAutoAnimate();

  return (
    <div className={className} ref={parent}>
      {
        showTeams && (
          <>
            {server.teams.map((team, _) => (
              <TeamRow
                {...team}
                key={`team-${team.name_color}-${team.name}`}
              />
            ))}

            <div className="my-2 h-0.5 bg-gradient-to-r from-red-400/20 via-orange-400 from-orange-400/20" />
          </>
        )
      }

      {server.players.map((player, _) => (
        <PlayerRow
          {...player}
          showTeam={showTeams}
          key={`player-${player.name_color}-${player.name}`}
        />
      ))}
    </div>
  );
};

const TeamRow = (props) => {
  const {
    name,
    frags,
    colors,
    ping,
  } = props;

  return (
    <div className="sc-row sc-row-team">
      <ColoredFrags tag="div" frags={frags} colors={colors} />
      <div>{name}</div>
      <Ping value={`${ping} ms`} />
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
    ping = 0,
    is_bot,
    showTeam,
  } = props;

  const columns = [
    <ColoredFrags tag="div" frags={frags} colors={colors} key="frags" />,
  ];

  if (showTeam) {
    columns.push(
      <QuakeText
        tag="div"
        text={coloredQuakeName(team, team_color)}
        className="text-center w-[46px]"
        key="team"
      />
    );
  }

  const nameColumnClassNames = ["flex items-center truncate max-w-[140px]"];
  let nameHtml = coloredQuakeName(name, name_color);

  if (is_bot) {
    nameColumnClassNames.push("text-amber-300/80");
  }

  columns.push(
    <QuakeText
      tag="div"
      text={nameHtml}
      className={nameColumnClassNames.join(" ")}
      key="name"
    />
  );

  let pingText = "";
  if (ping > 0) {
    pingText = is_bot ? "(bot)" : `${Math.min(666, ping)} ms`;
  }
  columns.push(<Ping value={pingText} />)

  return (
    <div className="sc-row sc-row-player">
      {columns}
    </div>
  );
};

const Ping = props => {
  const { value } = props;

  return (
    <span className="text-right text-xs opacity-50">{value}</span>
  )
}


