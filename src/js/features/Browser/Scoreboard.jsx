import React from "react";
import { QuakeText, ColoredFrags } from "./Common";

const ScoreboardRow = (props) => {
  const { Name, Frags, Colors, Team, displayTeam } = props;

  const columns = [];

  columns.push(<ColoredFrags tag="div" frags={Frags} colors={Colors} />);

  if (displayTeam) {
    columns.push(<QuakeText tag="div" text={Team} className="sc-team" />);
  }

  columns.push(<QuakeText tag="div" text={Name} className="sc-name" />);

  return columns;
};

export const ScoreboardList = (props) => {
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
        <ScoreboardRow {...p} displayTeam={displayTeam} />
      ))}
    </div>
  );
};

const GridItemRight = (props) =>
  ScoreboardRow({ ...props, displayTeams: false });
const GridItemLeft = (props) => GridItemRight(props).reverse();

export const ScoreboardGrid = (props) => {
  const { teams } = props;

  const teamOne = teams[0];
  const teamTwo = teams[1];

  const rowCount = Math.max(teamOne.PlayerCount, teamTwo.PlayerCount);

  const headerRow = GridItemLeft(teamOne).concat(GridItemRight(teamTwo));
  const rows = [headerRow];
  const emptyCells = [<div />, <div />];

  let cells;

  for (let i = 0; i < rowCount; i++) {
    cells = [];

    if (i <= teamOne.PlayerCount) {
      cells = cells.concat(GridItemLeft(teamOne.Players[i]));
    } else {
      cells = cells.concat(emptyCells);
    }

    if (i <= teamTwo.PlayerCount) {
      cells = cells.concat(GridItemRight(teamTwo.Players[i]));
    } else {
      cells = cells.concat(emptyCells);
    }

    rows.push(cells);
  }

  return <div className="scoreboard scoreboard-grid">{rows}</div>;
};
