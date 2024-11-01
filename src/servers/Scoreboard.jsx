import { QuakeText, coloredQuakeName } from "@qwhub/QuakeText";
import classNames from "classnames";
import { memo } from "react";
import { ColoredFrags } from "./ColoredFrags";

const sortByFrags = (a, b) => b.frags - a.frags;
const sortByName = (a, b) =>
  a.name.toLowerCase().localeCompare(b.name.toLowerCase());

export const Scoreboard = ({
  players = [],
  teams = [],
  showFrags = true,
  limit = 20,
}) => {
  const hasTeams = teams.length > 0;
  const showTeamColumn = hasTeams && teams.length <= 3;
  const sortFunc = showFrags ? sortByFrags : sortByName;
  const sortedPlayers = [...players];
  sortedPlayers.sort(sortFunc);
  const sortedTeams = [...teams];
  sortedTeams.sort(sortFunc);

  return (
    <div
      className={classNames("scoreboard", {
        "sc-hide-team": !hasTeams,
        "sc-hide-frags": !showFrags,
      })}
    >
      {showTeamColumn && (
        <>
          {sortedTeams.map((team) => (
            <TeamRow {...team} key={[team.name, team.name_color].join()} />
          ))}
          <div className="my-1.5 h-[1px] bg-gradient-to-r from-red-400/20 via-orange-400 to-orange-400/20" />
        </>
      )}
      {sortedPlayers.slice(0, limit).map((player) => (
        <PlayerRow
          key={[player.name, player.name_color].join()}
          showTeam={hasTeams}
          {...player}
        />
      ))}
    </div>
  );
};

const TeamRow = (props) => {
  const {
    name = "",
    name_color = "",
    frags = 0,
    colors = [0, 0],
    ping = 0,
  } = props;

  return (
    <div className="sc-row">
      <Ping value={ping ? `${ping} ms` : ""} />
      <div className="h-full py-px">
        <ColoredFrags frags={frags} colors={colors} />
      </div>
      <TeamName name={name} name_color={name_color} />
      <div />
    </div>
  );
};

const TeamName = memo((props) => {
  const { name = "", name_color = "" } = props;
  const maxLen = 4;

  return (
    <QuakeText
      text={coloredQuakeName(
        name.substring(0, maxLen),
        name_color.substring(0, maxLen),
      )}
      className="px-1 text-center"
    />
  );
});

const PlayerRow = (props) => {
  const {
    name = "",
    name_color = "",
    frags = 0,
    colors = [0, 0],
    team = "",
    team_color = "",
    ping = 0,
    cc = "",
    is_bot = false,
    showTeam = false,
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
      <div className="h-full py-px">
        <ColoredFrags frags={frags} colors={colors} />
      </div>
      {showTeam && <TeamName name={team} name_color={team_color} />}
      <span className="flex items-center">
        {cc && (
          <img
            src={`https://www.quakeworld.nu/images/flags/${cc.toLowerCase()}.gif`}
            alt={cc}
            width="16"
            height="11"
            className="mr-1"
          />
        )}
        <QuakeText
          tag="span"
          text={coloredQuakeName(name, name_color)}
          className={nameColumnClassNames}
        />
      </span>
    </div>
  );
};

const Ping = (props) => {
  const { value } = props;

  return <span className="text-right text-xs opacity-50">{value}</span>;
};
