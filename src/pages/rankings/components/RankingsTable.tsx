import React, { useState, useMemo, useEffect } from "react";
import classNames from "classnames";
import { getPlayerRankings, PlayerRanking } from "../services/api";

type SortDirection = "asc" | "desc";
type SortColumn = 
  | "name"
  | "avgFrags"
  | "avgDeaths"
  | "avgDamageGiven"
  | "efficiency"
  | "avgDamageTaken"
  | "avgTeamDamage"
  | "avgTK"
  | "avgRLDrops"
  | "avgRLTook"
  | "avgRLKills"
  | "avgSGAccuracy"
  | "avgLGAccuracy"
  | "avgRLDirects"
  | "avgQuads"
  | "avgEwep"
  | "avgToDie";

interface RankingsTableProps {
  gameMode: string;
  region: string;
}

export const RankingsTable: React.FC<RankingsTableProps> = ({ gameMode, region }) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>("avgFrags");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [rankings, setRankings] = useState<PlayerRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRankings() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPlayerRankings(gameMode, region);
        setRankings(data);
      } catch (err: any) {
        setError(err.message || "Failed to load rankings");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRankings();
  }, [gameMode, region]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const sortedData = useMemo(() => {
    const sorted = [...rankings].sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortColumn) {
        case "name":
          return sortDirection === "asc" 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case "avgFrags":
          aValue = a.avg_frags;
          bValue = b.avg_frags;
          break;
        case "avgDeaths":
          aValue = a.avg_deaths;
          bValue = b.avg_deaths;
          break;
        case "avgDamageGiven":
          aValue = a.avg_damage_given;
          bValue = b.avg_damage_given;
          break;
        case "efficiency":
          aValue = a.efficiency;
          bValue = b.efficiency;
          break;
        case "avgDamageTaken":
          aValue = a.avg_damage_taken;
          bValue = b.avg_damage_taken;
          break;
        case "avgTeamDamage":
          aValue = a.avg_team_damage;
          bValue = b.avg_team_damage;
          break;
        case "avgTK":
          aValue = a.avg_tk;
          bValue = b.avg_tk;
          break;
        case "avgRLDrops":
          aValue = a.avg_rl_drops;
          bValue = b.avg_rl_drops;
          break;
        case "avgRLTook":
          aValue = a.avg_rl_took;
          bValue = b.avg_rl_took;
          break;
        case "avgRLKills":
          aValue = a.avg_rl_kills;
          bValue = b.avg_rl_kills;
          break;
        case "avgSGAccuracy":
          aValue = a.avg_sg_accuracy;
          bValue = b.avg_sg_accuracy;
          break;
        case "avgLGAccuracy":
          aValue = a.avg_lg_accuracy;
          bValue = b.avg_lg_accuracy;
          break;
        case "avgRLDirects":
          aValue = a.avg_rl_directs;
          bValue = b.avg_rl_directs;
          break;
        case "avgQuads":
          aValue = a.avg_quads_taken;
          bValue = b.avg_quads_taken;
          break;
        case "avgEwep":
          aValue = a.avg_ewep;
          bValue = b.avg_ewep;
          break;
        case "avgToDie":
          aValue = a.avg_to_die;
          bValue = b.avg_to_die;
          break;
        default:
          aValue = 0;
          bValue = 0;
      }

      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });

    return sorted;
  }, [rankings, sortColumn, sortDirection]);

  const SortHeader: React.FC<{
    column: SortColumn;
    children: React.ReactNode;
    className?: string;
  }> = ({ column, children, className }) => {
    const isActive = sortColumn === column;
    return (
      <th
        className={classNames(
          "cursor-pointer hover:text-white transition-colors",
          className,
          isActive ? "text-white" : ""
        )}
        onClick={() => handleSort(column)}
      >
        <div className={classNames(
          "flex items-center gap-1",
          className?.includes("text-right") ? "justify-end" : ""
        )}>
          {children}
          {isActive && (
            <span className="text-xs">
              {sortDirection === "asc" ? "↑" : "↓"}
            </span>
          )}
        </div>
      </th>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-400">Loading rankings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (rankings.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-400">No ranking data available for {gameMode}</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-gray-400 text-xs border-b border-gray-800">
          <tr>
            <th className="text-center px-3 py-2 w-12">#</th>
            <SortHeader column="name" className="text-left px-3 py-2">
              Player
            </SortHeader>
            <SortHeader column="efficiency" className="text-right px-3 py-2">
              Efficiency
            </SortHeader>
            <SortHeader column="avgFrags" className="text-right px-3 py-2">
              Frags
            </SortHeader>
            <SortHeader column="avgDeaths" className="text-right px-3 py-2">
              Deaths
            </SortHeader>
            <SortHeader column="avgDamageGiven" className="text-right px-3 py-2">
              Given
            </SortHeader>
            <SortHeader column="avgDamageTaken" className="text-right px-3 py-2 hidden sm:table-cell">
              Taken
            </SortHeader>
            <SortHeader column="avgTeamDamage" className="text-right px-3 py-2 hidden sm:table-cell">
              Team
            </SortHeader>
            <SortHeader column="avgTK" className="text-right px-3 py-2 hidden sm:table-cell">
              TKs
            </SortHeader>
            <SortHeader column="avgEwep" className="text-right px-3 py-2 hidden md:table-cell">
              eWep
            </SortHeader>
            <SortHeader column="avgToDie" className="text-right px-3 py-2 hidden md:table-cell">
              To Die
            </SortHeader>
            <SortHeader column="avgRLTook" className="text-right px-3 py-2 hidden md:table-cell">
              RL Took
            </SortHeader>
            <SortHeader column="avgRLKills" className="text-right px-3 py-2 hidden md:table-cell">
              RL Kills
            </SortHeader>
            <SortHeader column="avgRLDrops" className="text-right px-3 py-2 hidden md:table-cell">
              RL Drops
            </SortHeader>
            <SortHeader column="avgSGAccuracy" className="text-right px-3 py-2 hidden lg:table-cell">
              SG%
            </SortHeader>
            <SortHeader column="avgLGAccuracy" className="text-right px-3 py-2 hidden lg:table-cell">
              LG%
            </SortHeader>
            <SortHeader column="avgRLDirects" className="text-right px-3 py-2 hidden lg:table-cell">
              RLD
            </SortHeader>
            <SortHeader column="avgQuads" className="text-right px-3 py-2 hidden xl:table-cell">
              Quads
            </SortHeader>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((player, index) => (
            <tr key={player.name} className="odd:bg-white/5 hover:bg-white/10">
              <td className="text-center px-3 py-2 text-gray-400">{index + 1}</td>
              <td className="px-3 py-2">
                <div dangerouslySetInnerHTML={{ __html: player.name_html || player.name }} />
                <div className="text-xs text-gray-500">{player.games_played} games</div>
              </td>
              <td className="text-right px-3 py-2">{player.efficiency.toFixed(1)}%</td>
              <td className="text-right px-3 py-2">{player.avg_frags.toFixed(1)}</td>
              <td className="text-right px-3 py-2">{player.avg_deaths.toFixed(1)}</td>
              <td className="text-right px-3 py-2">
                {player.avg_damage_given.toFixed(0)}
              </td>
              <td className="text-right px-3 py-2 hidden sm:table-cell">
                {player.avg_damage_taken.toFixed(0)}
              </td>
              <td className="text-right px-3 py-2 hidden sm:table-cell">
                {player.avg_team_damage.toFixed(0)}
              </td>
              <td className="text-right px-3 py-2 hidden sm:table-cell">
                {player.avg_tk.toFixed(1)}
              </td>
              <td className="text-right px-3 py-2 hidden md:table-cell">
                {player.avg_ewep.toFixed(1)}
              </td>
              <td className="text-right px-3 py-2 hidden md:table-cell">
                {player.avg_to_die.toFixed(1)}
              </td>
              <td className="text-right px-3 py-2 hidden md:table-cell">
                {player.avg_rl_took.toFixed(1)}
              </td>
              <td className="text-right px-3 py-2 hidden md:table-cell">
                {player.avg_rl_kills.toFixed(1)}
              </td>
              <td className="text-right px-3 py-2 hidden md:table-cell">
                {player.avg_rl_drops.toFixed(1)}
              </td>
              <td className="text-right px-3 py-2 hidden lg:table-cell">
                {player.avg_sg_accuracy.toFixed(1)}%
              </td>
              <td className="text-right px-3 py-2 hidden lg:table-cell">
                {player.avg_lg_accuracy.toFixed(1)}%
              </td>
              <td className="text-right px-3 py-2 hidden lg:table-cell">
                {player.avg_rl_directs.toFixed(1)}
              </td>
              <td className="text-right px-3 py-2 hidden xl:table-cell">
                {player.avg_quads_taken.toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};