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
  // Based on games page, it uses lowercase directly
  const dbMode = gameMode.toLowerCase();

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
      throw new Error("Failed to retrieve game data from server");
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
    throw error; // Re-throw the error to be handled by the component
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