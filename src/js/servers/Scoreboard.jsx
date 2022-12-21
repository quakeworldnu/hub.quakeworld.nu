import React from "react";
import { coloredQuakeName, QuakeText } from "./QuakeText.jsx";
import { ColoredFrags } from "./ColoredFrags.jsx";
import { useSelector } from "react-redux";
import {
  selectMetaByAddress,
  selectPlayersByAddress,
  selectTeamsByAddress
} from "../services/hub/servers";

export const Scoreboard = (props) => {
  const { address, limit = 20 } = props;
  const serverMeta = useSelector((state) => selectMetaByAddress(state, address));
  let className = "scoreboard ";
  className += serverMeta.showTeamColumn ? "sc-show-team" : "sc-hide-team";

  return (
    <div className={className}>
      {
        serverMeta.showTeams && (
          <>
            <Teams address={address} />
            <div className="my-1.5 h-[1px] bg-gradient-to-r from-red-400/20 via-orange-400 from-orange-400/20" />
          </>
        )
      }
      <Players address={address} showTeam={serverMeta.showTeamColumn} limit={limit} />
    </div>
  );
};

const Teams = props => {
  const { address } = props;
  const teams = useSelector((state) => selectTeamsByAddress(state, address));

  return (
    <>
      {teams && teams.map(team => (
        <TeamRow
          {...team}
          key={`team-${team.name_color}-${team.name}`}
        />
      ))}
    </>
  )
}

const TeamRow = React.memo((props) => {
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
      <TeamName name={name} name_color={name_color} />
      <div></div>
    </div>
  )
});


const TeamName = React.memo(props => {
    const { name, name_color } = props;
    const maxLen = 4;

    return (
        <QuakeText
        text={coloredQuakeName(name.substring(0, maxLen), name_color.substring(0, maxLen))}
        className="w-12 text-center"
        />
    );
});

const Players = props => {
  const { address, showTeam, limit = 20 } = props;
  const players = useSelector((state) => selectPlayersByAddress(state, address));

  return (
    <>
      {players &&
        players
          .slice(0, limit)
          .map((player, index) => (
            <PlayerRow
              {...player}
              showTeam={showTeam}
              key={`player-${index}`}
            />
          ))}
    </>
  );
};

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
    nameColumnClassNames += " text-amber-300/80";
  }

  return (
    <div className="sc-row sc-row-player">
      <Ping value={pingText} />
      <ColoredFrags frags={frags} colors={colors} />
      {showTeam && (
        <TeamName name={team} name_color={team_color} />
      )}
      <QuakeText
        text={coloredQuakeName(name, name_color)}
        className={nameColumnClassNames}
      />
    </div>
  );
};


const Ping = React.memo(props => {
  const { value } = props;

  return (
    <span className="text-right text-xs opacity-50">{value}</span>
  )
});
