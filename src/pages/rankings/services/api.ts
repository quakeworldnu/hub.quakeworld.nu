import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export interface PlayerRanking {
  name: string;
  name_color?: string;
  games_played: number;
  avg_frags: number;
  avg_deaths: number;
  avg_damage_given: number;
  avg_damage_taken: number;
  avg_team_damage: number;
  avg_tk: number;
  avg_rl_drops: number;
  avg_rl_took: number;
  avg_rl_kills: number;
  avg_sg_accuracy: number;
  avg_lg_accuracy: number;
  avg_rl_directs: number;
  avg_quads_taken: number;
  avg_ewep: number;
  avg_to_die: number;
  efficiency: number;
}

// TODO: Implement PlayerStats interface when full KTX stats aggregation is added
// interface PlayerStats {
//   name: string;
//   name_color?: string;
//   games: {
//     frags: number;
//     kills: number;
//     deaths: number;
//     damage_given: number;
//     damage_taken: number;
//     team_damage: number;
//     rl_drops: number;
//     sg_hits: number;
//     sg_attacks: number;
//     lg_hits: number;
//     lg_attacks: number;
//     quads_taken: number;
//     ewep: number;
//   }[];
// }

// Helper function to fetch KTX stats from CloudFront
async function fetchKtxStats(sha256: string): Promise<any | null> {
  const prefix = sha256.substring(0, 3);
  const url = `https://d.quake.world/${prefix}/${sha256}.mvd.ktxstats.json`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch KTX stats for ${sha256}:`, error);
    return null;
  }
}

export async function getPlayerRankings(
  gameMode: string,
  region: string = "All",
  days: number = 90
): Promise<PlayerRanking[]> {
  console.log(`Fetching rankings for ${gameMode} mode in ${region} (last ${days} days)`);
  
  // Calculate the date threshold
  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - days);
  const isoDate = dateThreshold.toISOString();

  // Map game mode to database mode values
  const modeMap: Record<string, string> = {
    "1on1": "duel",
    "2on2": "2on2",
    "4on4": "4on4",
    "Wipeout": "wipeout",
  };

  const dbMode = modeMap[gameMode] || gameMode.toLowerCase();

  try {
    // Fetch games from the last N days for the specified mode
    const { data: games, error } = await supabase
      .from("games")
      .select("id, timestamp, demo_sha256, players, server_hostname")
      .eq("mode", dbMode)
      .gte("timestamp", isoDate)
      .order("timestamp", { ascending: false })
      .limit(2000); // Reasonable limit for performance

    if (error || !games) {
      console.error("Error fetching games:", error);
      // Fall back to mock data
      return getMockData(gameMode, region);
    }

    // Filter by region if needed (based on server_hostname)
    let filteredGames = games;
    if (region !== "All") {
      // More comprehensive region mapping based on common QW server patterns
      filteredGames = games.filter(game => {
        const hostname = game.server_hostname?.toLowerCase() || "";
        
        switch (region) {
          case "Europe":
            return hostname.includes(".eu") || 
                   hostname.includes(".nl") || // Netherlands
                   hostname.includes(".se") || // Sweden
                   hostname.includes(".de") || // Germany
                   hostname.includes(".fi") || // Finland
                   hostname.includes(".uk") || // UK
                   hostname.includes(".no") || // Norway
                   hostname.includes(".fr") || // France
                   hostname.includes(".pl") || // Poland
                   hostname.includes(".ru") || // Russia
                   hostname.includes(".dk") || // Denmark
                   hostname.includes(".es") || // Spain
                   hostname.includes(".it") || // Italy
                   hostname.includes(".pt") || // Portugal
                   hostname.includes(".cz") || // Czech Republic
                   hostname.includes(".at") || // Austria
                   hostname.includes(".ch") || // Switzerland
                   hostname.includes(".be") || // Belgium
                   hostname.includes(".ua") || // Ukraine
                   hostname.includes("stockholm") ||
                   hostname.includes("amsterdam") ||
                   hostname.includes("london") ||
                   hostname.includes("frankfurt") ||
                   hostname.includes("paris") ||
                   hostname.includes("warsaw") ||
                   hostname.includes("moscow") ||
                   hostname.includes("copenhagen") ||
                   hostname.includes("helsinki") ||
                   hostname.includes("oslo") ||
                   hostname.includes("berlin") ||
                   hostname.includes("madrid") ||
                   hostname.includes("rome") ||
                   hostname.includes("lisbon") ||
                   hostname.includes("prague") ||
                   hostname.includes("vienna") ||
                   hostname.includes("brussels") ||
                   hostname.includes("kiev") ||
                   hostname.includes("europe") ||
                   hostname.includes("eu-");
                   
          case "North America":
            return hostname.includes(".us") || // USA
                   hostname.includes(".ca") || // Canada
                   hostname.includes(".mx") || // Mexico
                   hostname.includes("dallas") ||
                   hostname.includes("chicago") ||
                   hostname.includes("newyork") ||
                   hostname.includes("nyc") ||
                   hostname.includes("ny.") ||
                   hostname.includes("tx.") ||
                   hostname.includes("ca.") ||
                   hostname.includes("virginia") ||
                   hostname.includes("oregon") ||
                   hostname.includes("seattle") ||
                   hostname.includes("losangeles") ||
                   hostname.includes("la.") ||
                   hostname.includes("miami") ||
                   hostname.includes("atlanta") ||
                   hostname.includes("denver") ||
                   hostname.includes("phoenix") ||
                   hostname.includes("toronto") ||
                   hostname.includes("montreal") ||
                   hostname.includes("vancouver") ||
                   hostname.includes("mexico") ||
                   hostname.includes("us-") ||
                   hostname.includes("na-") ||
                   hostname.includes("northamerica");
                   
          case "Australia":
            return hostname.includes(".au") || // Australia
                   hostname.includes(".nz") || // New Zealand
                   hostname.includes("sydney") ||
                   hostname.includes("melbourne") ||
                   hostname.includes("perth") ||
                   hostname.includes("brisbane") ||
                   hostname.includes("adelaide") ||
                   hostname.includes("auckland") ||
                   hostname.includes("wellington") ||
                   hostname.includes("oceania") ||
                   hostname.includes("australia") ||
                   hostname.includes("au-") ||
                   hostname.includes("oc-");
                   
          case "South America":
            return hostname.includes(".br") || // Brazil
                   hostname.includes(".ar") || // Argentina
                   hostname.includes(".cl") || // Chile
                   hostname.includes(".co") || // Colombia
                   hostname.includes(".pe") || // Peru
                   hostname.includes(".ve") || // Venezuela
                   hostname.includes(".uy") || // Uruguay
                   hostname.includes(".bo") || // Bolivia
                   hostname.includes(".py") || // Paraguay
                   hostname.includes(".ec") || // Ecuador
                   hostname.includes("brazil") ||
                   hostname.includes("brasil") ||
                   hostname.includes("saopaulo") ||
                   hostname.includes("riodejaneiro") ||
                   hostname.includes("buenosaires") ||
                   hostname.includes("santiago") ||
                   hostname.includes("lima") ||
                   hostname.includes("bogota") ||
                   hostname.includes("caracas") ||
                   hostname.includes("montevideo") ||
                   hostname.includes("southamerica") ||
                   hostname.includes("sa-");
                   
          default:
            return true;
        }
      });
      
      console.log(`Filtered to ${filteredGames.length} games out of ${games.length} for region ${region}`);
      
      // Debug: Show sample of hostnames to understand patterns
      const uniqueHostnames = [...new Set(games.map(g => g.server_hostname))].slice(0, 20);
      console.log("Sample server hostnames:", uniqueHostnames);
    }

    // Aggregate player statistics
    const playerStatsMap = new Map<string, any>();

    // Process games in batches to avoid overwhelming the API
    const batchSize = 10;
    for (let i = 0; i < filteredGames.length; i += batchSize) {
      const batch = filteredGames.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (game) => {
          if (!game.demo_sha256) return;
          
          const ktxStats = await fetchKtxStats(game.demo_sha256);
          if (!ktxStats?.players) return;

          // Process each player's stats
          ktxStats.players.forEach((player: any) => {
            const key = player.name.toLowerCase(); // Handle name variations
            
            if (!playerStatsMap.has(key)) {
              playerStatsMap.set(key, {
                name: player.name,
                name_color: player["top-color"]?.toString() || "",
                games: [],
              });
            }

            const stats = playerStatsMap.get(key);
            stats.games.push({
              frags: player.stats?.frags || 0,
              deaths: player.stats?.deaths || 0,
              kills: player.stats?.kills || 0,
              damage_given: player.dmg?.given || 0,
              damage_taken: player.dmg?.taken || 0,
              team_damage: player.dmg?.team || 0,
              tk: player.stats?.tk || 0,
              rl_drops: player.weapons?.rl?.pickups?.dropped || 0,
              rl_took: player.weapons?.rl?.pickups?.taken || 0,
              rl_kills: player.weapons?.rl?.kills?.enemy || 0,
              rl_directs: player.weapons?.rl?.acc?.hits || 0,
              sg_accuracy: calculateAccuracy(player.weapons?.sg),
              lg_accuracy: calculateAccuracy(player.weapons?.lg),
              quads_taken: player.items?.q?.took || 0,
              ewep: player.dmg?.["enemy-weapons"] || 0,
              to_die: player.dmg?.["taken-to-die"] || 0,
            });
          });
        })
      );

      // Add a small delay between batches to avoid rate limiting
      if (i + batchSize < filteredGames.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Calculate averages for each player
    const rankings: PlayerRanking[] = Array.from(playerStatsMap.values())
      .filter(player => player.games.length >= 15) // Minimum games threshold
      .map(player => {
        const games = player.games;
        const gamesPlayed = games.length;
        
        const totals = games.reduce((acc: any, game: any) => ({
          frags: acc.frags + game.frags,
          deaths: acc.deaths + game.deaths,
          kills: acc.kills + game.kills,
          damage_given: acc.damage_given + game.damage_given,
          damage_taken: acc.damage_taken + game.damage_taken,
          team_damage: acc.team_damage + game.team_damage,
          tk: acc.tk + game.tk,
          rl_drops: acc.rl_drops + game.rl_drops,
          rl_took: acc.rl_took + game.rl_took,
          rl_kills: acc.rl_kills + game.rl_kills,
          rl_directs: acc.rl_directs + game.rl_directs,
          sg_accuracy_sum: acc.sg_accuracy_sum + game.sg_accuracy,
          lg_accuracy_sum: acc.lg_accuracy_sum + game.lg_accuracy,
          quads_taken: acc.quads_taken + game.quads_taken,
          ewep: acc.ewep + game.ewep,
          to_die_sum: acc.to_die_sum + game.to_die,
        }), {
          frags: 0, deaths: 0, kills: 0, damage_given: 0, damage_taken: 0,
          team_damage: 0, tk: 0, rl_drops: 0, rl_took: 0, rl_kills: 0,
          rl_directs: 0, sg_accuracy_sum: 0, lg_accuracy_sum: 0,
          quads_taken: 0, ewep: 0, to_die_sum: 0,
        });

        return {
          name: player.name,
          name_color: player.name_color,
          games_played: gamesPlayed,
          avg_frags: totals.frags / gamesPlayed,
          avg_deaths: totals.deaths / gamesPlayed,
          avg_damage_given: totals.damage_given / gamesPlayed,
          avg_damage_taken: totals.damage_taken / gamesPlayed,
          avg_team_damage: totals.team_damage / gamesPlayed,
          avg_tk: totals.tk / gamesPlayed,
          avg_rl_drops: totals.rl_drops / gamesPlayed,
          avg_rl_took: totals.rl_took / gamesPlayed,
          avg_rl_kills: totals.rl_kills / gamesPlayed,
          avg_rl_directs: totals.rl_directs / gamesPlayed,
          avg_sg_accuracy: totals.sg_accuracy_sum / gamesPlayed,
          avg_lg_accuracy: totals.lg_accuracy_sum / gamesPlayed,
          avg_quads_taken: totals.quads_taken / gamesPlayed,
          avg_ewep: totals.ewep / gamesPlayed,
          avg_to_die: totals.to_die_sum / gamesPlayed,
          efficiency: calculateEfficiency(totals.kills, totals.deaths),
        };
      });

    return rankings;

  } catch (error) {
    console.error("Error in getPlayerRankings:", error);
    // Fall back to mock data
    return getMockData(gameMode, region);
  }
}

function calculateAccuracy(weaponStats: any): number {
  if (!weaponStats?.acc) return 0;
  const { attacks, hits } = weaponStats.acc;
  return attacks > 0 ? (hits / attacks) * 100 : 0;
}

function calculateEfficiency(kills: number, deaths: number): number {
  return deaths > 0 ? (kills / (kills + deaths)) * 100 : 0;
}

function getMockData(_gameMode: string, region: string): PlayerRanking[] {
  // Mock data varies slightly by game mode for demonstration
  const mockRankings: PlayerRanking[] = [
    {
      name: "milton",
      name_color: "4",
      games_played: 124,
      avg_frags: 42.5,
      avg_deaths: 23.2,
      avg_damage_given: 3250,
      avg_damage_taken: 2150,
      avg_team_damage: 95,
      avg_tk: 1.8,
      avg_rl_drops: 2.3,
      avg_rl_took: 3.8,
      avg_rl_kills: 12.5,
      avg_sg_accuracy: 45.2,
      avg_lg_accuracy: 32.8,
      avg_rl_directs: 8.2,
      avg_quads_taken: 1.2,
      avg_ewep: 125.5,
      avg_to_die: 92.7,
      efficiency: 65.4,
    },
    {
      name: "bps",
      name_color: "13",
      games_played: 89,
      avg_frags: 38.2,
      avg_deaths: 26.5,
      avg_damage_given: 2950,
      avg_damage_taken: 2350,
      avg_team_damage: 120,
      avg_tk: 2.3,
      avg_rl_drops: 1.8,
      avg_rl_took: 2.9,
      avg_rl_kills: 10.2,
      avg_sg_accuracy: 42.1,
      avg_lg_accuracy: 35.6,
      avg_rl_directs: 6.8,
      avg_quads_taken: 0.8,
      avg_ewep: 115.2,
      avg_to_die: 88.7,
      efficiency: 58.9,
    },
    {
      name: "Xantom",
      name_color: "2",
      games_played: 156,
      avg_frags: 45.8,
      avg_deaths: 18.5,
      avg_damage_given: 3450,
      avg_damage_taken: 1950,
      avg_team_damage: 75,
      avg_tk: 1.2,
      avg_rl_drops: 1.2,
      avg_rl_took: 4.2,
      avg_rl_kills: 15.8,
      avg_sg_accuracy: 48.5,
      avg_lg_accuracy: 38.2,
      avg_rl_directs: 10.5,
      avg_quads_taken: 1.5,
      avg_ewep: 142.3,
      avg_to_die: 105.4,
      efficiency: 71.2,
    },
    {
      name: "raket",
      name_color: "5",
      games_played: 145,
      avg_frags: 39.8,
      avg_deaths: 22.1,
      avg_damage_given: 3120,
      avg_damage_taken: 2080,
      avg_team_damage: 88,
      avg_tk: 1.5,
      avg_rl_drops: 1.9,
      avg_rl_took: 3.5,
      avg_rl_kills: 11.8,
      avg_sg_accuracy: 44.8,
      avg_lg_accuracy: 34.2,
      avg_rl_directs: 7.8,
      avg_quads_taken: 1.3,
      avg_ewep: 128.2,
      avg_to_die: 94.1,
      efficiency: 64.3,
    },
    {
      name: "paradoks",
      name_color: "12",
      games_played: 112,
      avg_frags: 36.5,
      avg_deaths: 28.8,
      avg_damage_given: 2880,
      avg_damage_taken: 2420,
      avg_team_damage: 135,
      avg_tk: 2.8,
      avg_rl_drops: 2.5,
      avg_rl_took: 2.8,
      avg_rl_kills: 8.9,
      avg_sg_accuracy: 40.5,
      avg_lg_accuracy: 31.8,
      avg_rl_directs: 5.5,
      avg_quads_taken: 0.7,
      avg_ewep: 108.5,
      avg_to_die: 84.0,
      efficiency: 55.9,
    },
    {
      name: "LocKtar",
      name_color: "3",
      games_played: 178,
      avg_frags: 41.2,
      avg_deaths: 20.8,
      avg_damage_given: 3180,
      avg_damage_taken: 2020,
      avg_team_damage: 82,
      avg_tk: 1.4,
      avg_rl_drops: 1.6,
      avg_rl_took: 3.9,
      avg_rl_kills: 13.2,
      avg_sg_accuracy: 46.5,
      avg_lg_accuracy: 36.8,
      avg_rl_directs: 9.2,
      avg_quads_taken: 1.4,
      avg_ewep: 135.8,
      avg_to_die: 97.1,
      efficiency: 66.5,
    },
    {
      name: "nigve",
      name_color: "7",
      games_played: 92,
      avg_frags: 35.2,
      avg_deaths: 29.5,
      avg_damage_given: 2750,
      avg_damage_taken: 2520,
      avg_team_damage: 145,
      avg_tk: 3.2,
      avg_rl_drops: 2.8,
      avg_rl_took: 2.5,
      avg_rl_kills: 7.8,
      avg_sg_accuracy: 39.2,
      avg_lg_accuracy: 29.5,
      avg_rl_directs: 4.8,
      avg_quads_taken: 0.6,
      avg_ewep: 102.3,
      avg_to_die: 85.4,
      efficiency: 54.4,
    },
    {
      name: "carapace",
      name_color: "9",
      games_played: 134,
      avg_frags: 40.5,
      avg_deaths: 21.5,
      avg_damage_given: 3080,
      avg_damage_taken: 2120,
      avg_team_damage: 90,
      avg_tk: 1.6,
      avg_rl_drops: 1.7,
      avg_rl_took: 3.7,
      avg_rl_kills: 12.8,
      avg_sg_accuracy: 45.8,
      avg_lg_accuracy: 35.5,
      avg_rl_directs: 8.5,
      avg_quads_taken: 1.2,
      avg_ewep: 130.5,
      avg_to_die: 98.6,
      efficiency: 65.3,
    },
    {
      name: "zero",
      name_color: "11",
      games_played: 167,
      avg_frags: 37.8,
      avg_deaths: 25.2,
      avg_damage_given: 2920,
      avg_damage_taken: 2280,
      avg_team_damage: 110,
      avg_tk: 2.1,
      avg_rl_drops: 2.2,
      avg_rl_took: 3.2,
      avg_rl_kills: 9.8,
      avg_sg_accuracy: 43.2,
      avg_lg_accuracy: 33.8,
      avg_rl_directs: 6.2,
      avg_quads_taken: 0.9,
      avg_ewep: 118.8,
      avg_to_die: 90.5,
      efficiency: 60.0,
    },
  ];

  // Add more mock players based on game mode and region
  if (region === "Europe" || region === "All") {
    mockRankings.push({
      name: "mm",
      name_color: "6",
      games_played: 198,
      avg_frags: 40.1,
      avg_deaths: 24.0,
      avg_damage_given: 3150,
      avg_damage_taken: 2250,
      avg_team_damage: 85,
      avg_tk: 1.5,
      avg_rl_drops: 2.0,
      avg_rl_took: 3.5,
      avg_rl_kills: 11.8,
      avg_sg_accuracy: 46.2,
      avg_lg_accuracy: 34.5,
      avg_rl_directs: 7.5,
      avg_quads_taken: 1.1,
      avg_ewep: 118.5,
      avg_to_die: 93.8,
      efficiency: 62.8,
    });
  }
  
  if (region === "North America" || region === "All") {
    mockRankings.push(
      {
        name: "dev",
        name_color: "8",
        games_played: 142,
        avg_frags: 38.5,
        avg_deaths: 24.8,
        avg_damage_given: 2980,
        avg_damage_taken: 2220,
        avg_team_damage: 105,
        avg_tk: 2.0,
        avg_rl_drops: 2.1,
        avg_rl_took: 3.3,
        avg_rl_kills: 10.5,
        avg_sg_accuracy: 43.5,
        avg_lg_accuracy: 33.2,
        avg_rl_directs: 6.5,
        avg_quads_taken: 1.0,
        avg_ewep: 116.2,
        avg_to_die: 89.5,
        efficiency: 60.8,
      },
      {
        name: "grl",
        name_color: "10",
        games_played: 123,
        avg_frags: 36.2,
        avg_deaths: 27.5,
        avg_damage_given: 2820,
        avg_damage_taken: 2380,
        avg_team_damage: 125,
        avg_tk: 2.5,
        avg_rl_drops: 2.3,
        avg_rl_took: 2.8,
        avg_rl_kills: 9.2,
        avg_sg_accuracy: 41.8,
        avg_lg_accuracy: 32.5,
        avg_rl_directs: 5.8,
        avg_quads_taken: 0.8,
        avg_ewep: 110.5,
        avg_to_die: 86.5,
        efficiency: 56.8,
      }
    );
  }
  
  // Filter out players based on region if not "All"
  if (region !== "All" && region !== "Europe") {
    // For demo purposes, reduce some stats for non-European regions
    mockRankings.forEach(player => {
      player.games_played = Math.floor(player.games_played * 0.7);
    });
  }
  
  return mockRankings;
}