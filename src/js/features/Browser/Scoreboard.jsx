import React from "react";
import { QuakeText, ColoredFrags } from "./Common";

const PlayerRow = (props) => {
  const { Name, Frags, Colors, Team, displayTeam } = props;

  const columns = [<ColoredFrags tag="div" frags={Frags} colors={Colors} />];

  if (displayTeam) {
    columns.push(<QuakeText tag="div" text={Team} className="sc-team" />);
  }

  columns.push(<QuakeText tag="div" text={Name} className="sc-name" />);

  return columns;
};

export const OneColumnScoreboard = (props) => {
  const { players, displayTeam } = props;

  let className = "scoreboard scoreboard-list ";

  if (displayTeam) {
    className += "sc-team";
  } else {
    className += "sc-noteam";
  }

  return (
    <div className={className}>
      {players.map((p) => (
        <PlayerRow {...p} displayTeam={displayTeam} />
      ))}
    </div>
  );
};

const RightColumnRow = (props) => PlayerRow({ ...props, displayTeam: false });
const LeftColumnRow = (props) => RightColumnRow(props).reverse();

export const TwoColumnScoreboard = (props) => {
  const { teams } = props;

  const teamOne = teams[0];
  const teamTwo = teams[1];

  const rowCount = Math.max(teamOne.PlayerCount, teamTwo.PlayerCount);

  const headerRow = LeftColumnRow(teamOne).concat(RightColumnRow(teamTwo));
  const rows = [headerRow];
  const emptyRow = [<div />, <div />];

  let cells;

  for (let i = 0; i < rowCount; i++) {
    cells = [];

    if (i <= teamOne.PlayerCount) {
      cells = cells.concat(LeftColumnRow(teamOne.Players[i]));
    } else {
      cells = cells.concat(emptyRow);
    }

    if (i <= teamTwo.PlayerCount) {
      cells = cells.concat(RightColumnRow(teamTwo.Players[i]));
    } else {
      cells = cells.concat(emptyRow);
    }

    rows.push(cells);
  }

  return <div className="scoreboard scoreboard-grid">{rows}</div>;
};
