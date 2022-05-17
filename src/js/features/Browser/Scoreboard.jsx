import React from "react";
import { ColoredFrags, QuakeText } from "./Common";

export const Scoreboard = (props) => {
  const { server, limit = 20 } = props;

  if (!server.PlayerSlots.Used || 0 === limit) {
    return null;
  }

  if ("1on1" === server.Mode || 2 === server.Teams.length) {
    return (
      <TwoColumnScoreboard
        players={server.Players}
        teams={server.Teams}
        limit={limit}
      />
    );
  } else {
    return (
      <OneColumnScoreboard
        players={server.Players}
        showTeam={"teamplay" in server.Settings && server.Settings.teamplay > 0}
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
  const { players, teams, limit } = props;

  let items = [];

  if (teams.length > 0) {
    items = items.concat(teams);

    let rowCount = Math.max(...teams.map((t) => t.Players.length));
    rowCount = Math.min(rowCount, Math.ceil(limit / 2));

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      for (let teamIndex = 0; teamIndex < teams.length; teamIndex++) {
        if (rowIndex < teams[teamIndex].Players.length) {
          items.push(teams[teamIndex].Players[rowIndex]);
        } else {
          items.push(null);
        }
      }
    }
  } else {
    items = players;
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
