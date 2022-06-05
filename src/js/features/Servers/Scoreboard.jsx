import React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { QuakeText } from "../Quake/QuakeText.jsx";
import { ColoredFrags } from "../Quake/ColoredFrags.jsx";

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
        players={server.Players.slice(0, limit)}
        showTeam={"teamplay" in server.Settings && server.Settings.teamplay > 0}
      />
    );
  }
};

const ItemRow = (props) => {
  const { Name, NameColor, Frags, Colors, Team, TeamColor, showTeam } = props;

  const columns = [
    <ColoredFrags tag="div" frags={Frags} colors={Colors} key="frags" />,
  ];

  if (showTeam) {
    columns.push(
      <QuakeText
        tag="div"
        text={Team}
        color={TeamColor}
        className="sc-team"
        key="team"
      />
    );
  }

  columns.push(
    <QuakeText
      tag="div"
      text={Name}
      color={NameColor}
      className="sc-name"
      key="name"
    />
  );

  const keyPrefix = "Players" in props ? "team" : "player";
  const key = `${keyPrefix}-${NameColor}-${Name}`;

  return (
    <div className="sc-row" key={key}>
      {columns}
    </div>
  );
};

export const OneColumnScoreboard = (props) => {
  const { players, showTeam } = props;

  let className = "scoreboard sc-one-column ";
  className += showTeam ? "sc-show-team" : "sc-hide-team";

  const [parent] = useAutoAnimate();

  return (
    <>
      <div className={className} ref={parent}>
        {players.map((player, _) => (
          <ItemRow
            {...player}
            showTeam={showTeam}
            key={`${player.NameColor}-${player.Name}`}
          />
        ))}
      </div>
    </>
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
  const leftColumn = [];
  const rightColumn = [];
  const columns = [leftColumn, rightColumn];

  for (let i = 0; i < rows.length; i++) {
    columns[i % 2].push(rows[i]);
  }

  const [parent] = useAutoAnimate();

  return (
    <>
      <div className="scoreboard sc-teamplay sc-two-columns" ref={parent}>
        <div className="sc-column">{leftColumn}</div>
        <div className="sc-column">{rightColumn}</div>
      </div>
    </>
  );
};

const itemToRow = (item, index) => {
  if (null === item) {
    return <div className="sc-row" key={`empty-${index}`} />;
  } else {
    return ItemRow(item);
  }
};
