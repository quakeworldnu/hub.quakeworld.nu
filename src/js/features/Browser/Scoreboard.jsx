import React from "react";
import { ColoredFrags, QuakeText } from "./Common";

export const Scoreboard = (props) => {
  const { server } = props;

  if (!server.meta.hasPlayers) {
    return null;
  }

  let showAsTwoColumns =
    server.meta.mode.isDuel || 2 === server.meta.teams.length;
  let players = server.Players.filter((p) => !p.Spec);

  if (showAsTwoColumns) {
    return <TwoColumnScoreboard players={players} teams={server.meta.teams} />;
  } else {
    return (
      <OneColumnScoreboard
        players={players}
        showTeam={server.meta.mode.isTeamplay}
      />
    );
  }
};

const ItemRow = (props) => {
  const { Name, Frags, Colors, Team, showTeam } = props;

  const columns = [<ColoredFrags tag="div" frags={Frags} colors={Colors} />];

  if (showTeam) {
    columns.push(<QuakeText tag="div" text={Team} className="sc-team" />);
  }

  columns.push(<QuakeText tag="div" text={Name} className="sc-name" />);

  return columns;
};

export const OneColumnScoreboard = (props) => {
  const { players, showTeam } = props;

  let className = "scoreboard sc-one-column ";

  if (showTeam) {
    className += "sc-show-team";
  } else {
    className += "sc-hide-team";
  }

  return (
    <div className={className}>
      {players.map((player) => (
        <ItemRow {...player} showTeam={showTeam} />
      ))}
    </div>
  );
};

export const TwoColumnScoreboard = (props) => {
  const { teams, players } = props;

  let items = [];

  if (0 === teams.length) {
    items = players;
  } else if (teams) {
    items = items.concat(teams);

    const rowCount = Math.max(...teams.map((t) => t.PlayerCount));

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      for (let teamIndex = 0; teamIndex < teams.length; teamIndex++) {
        if (rowIndex < teams[teamIndex].PlayerCount) {
          items.push(teams[teamIndex].Players[rowIndex]);
        } else {
          items.push(null);
        }
      }
    }
  }

  const rows = items.map(itemToRow);

  return <div className="scoreboard sc-two-columns">{rows}</div>;
};

const RightColumnRow = (props) => ItemRow({ ...props, showTeam: false });
const LeftColumnRow = (props) => RightColumnRow(props).reverse();

const itemToRow = (item, itemIndex) => {
  if (null === item) {
    return [<div />, <div />];
  } else {
    let formatFunc = 0 === itemIndex % 2 ? LeftColumnRow : RightColumnRow;
    return formatFunc(item);
  }
};
