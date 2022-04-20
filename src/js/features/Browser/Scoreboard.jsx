import React from "react";
import { ColoredFrags, QuakeText } from "./Common";

export const Scoreboard = (props) => {
  const { server, limit = 20 } = props;

  if (!server.meta.hasPlayers || 0 === limit) {
    return null;
  }

  if (server.meta.showAsTwoColumns) {
    return <TwoColumnScoreboard teams={server.meta.teams} limit={limit} />;
  } else {
    const players = server.Players.filter((p) => !p.Spec).slice(0, limit);

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

  const columns = [
    <ColoredFrags tag="div" frags={Frags} colors={Colors} key="frags" />,
  ];

  if (showTeam) {
    columns.push(
      <QuakeText tag="div" text={Team} className="sc-team" key="team" />
    );
  }

  columns.push(
    <QuakeText tag="div" text={Name} className="sc-name" key="name" />
  );

  return columns;
};

export const OneColumnScoreboard = (props) => {
  const { players, showTeam } = props;

  let className = "scoreboard sc-one-column ";
  className += showTeam ? "sc-show-team" : "sc-hide-team";

  return (
    <div className={className}>
      {players.map((player, playerIndex) => (
        <ItemRow {...player} showTeam={showTeam} key={playerIndex} />
      ))}
    </div>
  );
};

export const TwoColumnScoreboard = (props) => {
  const { teams, limit } = props;

  let items = [];

  items = items.concat(teams);

  let rowCount = Math.max(...teams.map((t) => t.PlayerCount));
  rowCount = Math.min(rowCount, Math.ceil(limit / 2));

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    for (let teamIndex = 0; teamIndex < teams.length; teamIndex++) {
      if (rowIndex < teams[teamIndex].PlayerCount) {
        items.push(teams[teamIndex].Players[rowIndex]);
      } else {
        items.push(null);
      }
    }
  }

  const rows = items.map(itemToRow);

  return <div className="scoreboard sc-teamplay sc-two-columns">{rows}</div>;
};

const RightColumnRow = (props) => ItemRow({ ...props, showTeam: false });
const LeftColumnRow = (props) => RightColumnRow(props).reverse();

const itemToRow = (item, itemIndex) => {
  if (null === item) {
    return [<div key="empty-1" />, <div key="empty-2" />];
  } else {
    let formatFunc = 0 === itemIndex % 2 ? LeftColumnRow : RightColumnRow;
    return formatFunc(item);
  }
};
