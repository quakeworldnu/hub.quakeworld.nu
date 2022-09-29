import React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { coloredQuakeName, QuakeText } from "./QuakeText.jsx";
import { ColoredFrags } from "./ColoredFrags.jsx";

export const Scoreboard = (props) => {
  const { server, limit = 20 } = props;

  if (0 === server.player_slots.used || 0 === limit) {
    return null;
  }

  if ("1on1" === server.mode || 2 === server.teams.length) {
    return (
      <TwoColumnScoreboard
        players={server.players}
        teams={server.teams}
        limit={limit}
      />
    );
  } else {
    return (
      <OneColumnScoreboard
        players={server.players.slice(0, limit)}
        showTeam={"teamplay" in server.settings && server.settings.teamplay > 0}
      />
    );
  }
};

const ItemRow = (props) => {
  const {
    name,
    name_color,
    frags,
    colors,
    team,
    team_color,
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
        className="w-[46px]"
        key="team"
      />
    );
  }

  const nameColumnClassNames = ["sc-name"];
  let nameHtml = coloredQuakeName(name, name_color);

  if (is_bot) {
    nameHtml = `${nameHtml} <span class="rounded bg-black px-1 ml-1 font-mono text-xs">bot</span>`;
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

  const keyPrefix = "players" in props ? "team" : "player";
  const key = `${keyPrefix}-${name_color}-${name}`;

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
            key={`${player.name_color}-${player.name}`}
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

    let rowCount = Math.max(...teams.map((t) => t.players.length));
    rowCount = Math.min(rowCount, Math.ceil(limit / 2));

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      for (let teamIndex = 0; teamIndex < teams.length; teamIndex++) {
        if (rowIndex < teams[teamIndex].players.length) {
          items.push(teams[teamIndex].players[rowIndex]);
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
      <div className={`scoreboard sc-two-columns sc-teams-${teams.length}`} ref={parent}>
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
