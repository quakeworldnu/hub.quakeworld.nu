import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export interface PlayerRanking {
  name: string;
  name_color?: string;
  name_html: string; // Pre-rendered HTML with color spans
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

// Helper function to convert Quake names to HTML with proper coloring
function quakeNameToColoredHtml(name: string): string {
  let html = "";
  let currentType = "normal";

  const changeType = (newType: string) => {
    if (currentType !== newType) {
      if (currentType !== "normal") {
        html += "</span>";
      }
      if (newType !== "normal") {
        html += `<span class="qw-color-${newType}">`;
      }
      currentType = newType;
    }
  };

  for (let i = 0; i < name.length; i++) {
    let ch = name.charCodeAt(i);
    const originalCh = ch;
    
    // Strip high bit if set
    if (ch >= 128) {
      ch = ch - 128;
    }

    // Handle special characters
    if (ch < 16 || (ch >= 29 && ch <= 31)) {
      changeType("normal");
      html += "_";
    } else if (ch === 16) {
      changeType("g");
      html += "[";
    } else if (ch === 17) {
      changeType("g");
      html += "]";
    } else if (ch >= 18 && ch <= 27) {
      // Convert to numbers 0-9
      const num = ch - 18 + 48;
      changeType("g");
      html += String.fromCharCode(num);
    } else if (ch === 28) {
      changeType("normal");
      html += "•";
    } else {
      // Characters with original value >= 160 (128 + 32) are brown
      if (originalCh >= 160) {
        changeType("b");
      } else {
        changeType("normal");
      }

      // HTML escape special characters
      if (ch === 60) { // <
        html += "&lt;";
      } else if (ch === 62) { // >
        html += "&gt;";
      } else if (ch === 34) { // "
        html += "&quot;";
      } else {
        html += String.fromCharCode(ch);
      }
    }
  }
  
  changeType("normal"); // Close any open span
  return html;
}

// Simple name cleaning for comparison purposes
function cleanQuakeName(name: string): string {
  let result = "";
  for (let i = 0; i < name.length; i++) {
    let ch = name.charCodeAt(i);
    
    if (ch >= 128) {
      ch = ch - 128;
    }
    
    if (ch >= 18 && ch <= 27) {
      ch = ch - 18 + 48; // Convert to 0-9
    } else if (ch === 16) {
      ch = 91; // [
    } else if (ch === 17) {
      ch = 93; // ]
    } else if (ch === 28) {
      result += "•";
      continue;
    } else if (ch < 16 || (ch >= 29 && ch <= 31)) {
      result += "_";
      continue;
    }
    
    result += String.fromCharCode(ch);
  }
  return result;
}

// Clean name and color string together for Hub API format
function cleanQuakeNameAndColor(name: string, colorStr: string): { name: string; color: string } {
  let resultName = "";
  let resultColor = "";
  
  for (let i = 0; i < name.length; i++) {
    let ch = name.charCodeAt(i);
    const colorChar = i < colorStr.length ? colorStr[i] : "w";
    
    // Convert special Quake characters
    if (ch >= 128) {
      ch = ch - 128;
    }
    
    // Convert special characters
    if (ch >= 18 && ch <= 27) {
      ch = ch - 18 + 48;
      resultName += String.fromCharCode(ch);
      resultColor += colorChar;
    } else if (ch === 16) {
      resultName += "[";
      resultColor += colorChar;
    } else if (ch === 17) {
      resultName += "]";
      resultColor += colorChar;
    } else if (ch === 28) {
      resultName += "•";
      resultColor += colorChar;
    } else if (ch < 16 || (ch >= 29 && ch <= 31)) {
      resultName += "_";
      resultColor += colorChar;
    } else {
      resultName += String.fromCharCode(ch);
      resultColor += colorChar;
    }
  }
  
  return { name: resultName, color: resultColor };
}

// Generate HTML from clean name and color string (Hub API format)
function generateColoredHtml(name: string, colorStr: string): string {
  let html = "";
  let currentColor = "";
  let inSpan = false;

  for (let i = 0; i < name.length; i++) {
    const color = i < colorStr.length ? colorStr[i] : "w";
    
    if (color !== currentColor) {
      if (inSpan) {
        html += "</span>";
        inSpan = false;
      }
      
      // Only create span for non-white colors
      if (color !== "w") {
        html += `<span class="qw-color-${color}">`;
        inSpan = true;
      }
      
      currentColor = color;
    }
    
    const ch = name[i];
    if (ch === "<") {
      html += "&lt;";
    } else if (ch === ">") {
      html += "&gt;";
    } else if (ch === '"') {
      html += "&quot;";
    } else {
      html += ch;
    }
  }
  
  if (inSpan) {
    html += "</span>";
  }
  
  return html;
}

// Helper function to fetch KTX stats from CloudFront
async function fetchKtxStats(sha256: string, abortSignal?: AbortSignal): Promise<any | null> {
  const prefix = sha256.substring(0, 3);
  const url = `https://d.quake.world/${prefix}/${sha256}.mvd.ktxstats.json`;
  
  try {
    const response = await fetch(url, { signal: abortSignal });
    if (!response.ok) {
      // Don't log 403/404 errors as they're common for missing stats
      if (response.status !== 403 && response.status !== 404) {
        console.error(`Failed to fetch KTX stats for ${sha256}: ${response.status} ${response.statusText}`);
      }
      return null;
    }
    return await response.json();
  } catch (error: any) {
    if (error.name === 'AbortError') {
      // Request was aborted, don't log
      return null;
    }
    console.error(`Failed to fetch KTX stats for ${sha256}:`, error);
    return null;
  }
}

export async function getPlayerRankings(
  gameMode: string,
  region: string = "All",
  days: number = 90,
  abortSignal?: AbortSignal
): Promise<PlayerRanking[]> {
  // Calculate the date threshold
  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - days);
  const isoDate = dateThreshold.toISOString();

  // Map game mode to database mode values
  // Based on games page, it uses lowercase directly
  const dbMode = gameMode.toLowerCase();
  
  console.log(`Fetching rankings for ${gameMode} mode (db: ${dbMode}) in ${region} (last ${days} days)`);

  try {
    // Fetch all games from the last N days for the specified mode
    // Supabase has a default limit of 1000 rows, so we need to paginate
    let allGames: any[] = [];
    let rangeStart = 0;
    const pageSize = 1000;
    let hasMore = true;
    
    while (hasMore) {
      // Check if request was aborted
      if (abortSignal?.aborted) {
        throw new DOMException('Request aborted', 'AbortError');
      }
      
      const rangeEnd = rangeStart + pageSize - 1;
      
      const { data: games, error, count } = await supabase
        .from("games")
        .select("id, timestamp, demo_sha256, players, server_hostname", { count: "exact" })
        .eq("mode", dbMode)
        .gte("timestamp", isoDate)
        .order("timestamp", { ascending: false })
        .range(rangeStart, rangeEnd);

      if (error || !games) {
        console.error("Error fetching games:", error);
        throw new Error("Failed to retrieve game data from server");
      }
      
      allGames = allGames.concat(games);
      
      // Check if we have more pages
      hasMore = games.length === pageSize;
      rangeStart += pageSize;
      
      // Log progress
      if (count) {
        console.log(`Fetched ${allGames.length} of ${count} ${dbMode} games...`);
      }
    }
    
    const games = allGames;
    console.log(`Found ${games.length} ${dbMode} games in last ${days} days`);
    

    // Filter by region if needed (based on server_hostname)
    let filteredGames = games;
    if (region !== "All") {
      // More comprehensive region mapping based on common QW server patterns
      filteredGames = games.filter(game => {
        const hostname = game.server_hostname?.toLowerCase() || "";
        
        // Skip games without hostname
        if (!hostname) {
          console.log("Game without hostname found:", game.id);
          return false;
        }
        
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
                   hostname.includes("eu-") ||
                   // Actual server patterns from the list
                   hostname.includes("quake.se") ||
                   hostname.includes("dm6.uk") ||
                   hostname.includes("clanrot.org") ||
                   hostname.includes("zasadzka") ||
                   hostname.includes("de.quake.world") ||
                   hostname.includes("nl.quake.world") ||
                   hostname.includes("uk.clanrot") ||
                   hostname.includes("pl.clanrot") ||
                   hostname.includes("troopers.fi") ||
                   hostname.includes("snapcase.net") ||
                   hostname.includes("servequake.com") ||
                   hostname.includes("baseq.fr") ||
                   hostname.includes("predze.dk") ||
                   hostname.includes("lgquad.ru") ||
                   hostname.includes("0f.se") ||
                   hostname.includes("funkyqw") ||
                   hostname.includes("das pentagon") ||
                   hostname.includes("gladius spb") ||
                   hostname.includes("qw-group") ||
                   hostname.includes("andehlag");
                   
          case "North America":
            return hostname.includes("ny.quake.world") ||
                   hostname.includes("la.quake.world") ||
                   hostname.includes("dal.spawnfrag.com") ||
                   hostname.includes("usqw") ||
                   hostname.includes("wa.b1aze.com") ||
                   hostname.includes("mom's basement") ||
                   hostname.includes("the-den") ||
                   hostname.includes("naqw"); // North American QuakeWorld
                   
          case "Australia":
            return hostname.includes(".au") || // Australia
                   hostname.includes(".nz") || // New Zealand
                   hostname.includes("thickshaker") || // Australian servers
                   hostname.includes("swoopshaker") || // Australian servers
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
                   hostname.includes("sa-") ||
                   // Actual server patterns from the list
                   hostname.includes("quakeworld.com.br") ||
                   hostname.includes("qlash brasil");
                   
          default:
            return true;
        }
      });
      
      console.log(`Filtered to ${filteredGames.length} games out of ${games.length} for region ${region}`);
    }

    // Aggregate player statistics
    const playerStatsMap = new Map<string, any>();
    let gamesWithStats = 0;
    let gamesWithoutStats = 0;

    // Process games in batches to avoid overwhelming the API
    const batchSize = 10;
    for (let i = 0; i < filteredGames.length; i += batchSize) {
      // Check if request was aborted before processing each batch
      if (abortSignal?.aborted) {
        throw new DOMException('Request aborted', 'AbortError');
      }
      
      const batch = filteredGames.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (game) => {
          if (!game.demo_sha256) {
            gamesWithoutStats++;
            return;
          }
          
          const ktxStats = await fetchKtxStats(game.demo_sha256, abortSignal);
          if (!ktxStats?.players) {
            gamesWithoutStats++;
            return;
          }

          // Process each player's stats
          if (!ktxStats.players || ktxStats.players.length === 0) {
            gamesWithoutStats++;
            return;
          }
          
          gamesWithStats++;
          
          ktxStats.players.forEach((player: any) => {
            const cleanName = cleanQuakeName(player.name);
            const key = cleanName.toLowerCase(); // Handle name variations
            
            if (!playerStatsMap.has(key)) {
              // Get original name from the game's players array in Supabase
              const gamePlayer = game.players?.find((p: any) => 
                cleanQuakeName(p.name).toLowerCase() === key
              );
              
              let nameHtml = "";
              
              if (gamePlayer) {
                // Check if we have a color string (Hub API format) or need to use byte values
                if (gamePlayer.name_color && gamePlayer.name_color.match(/^[wbg]+$/)) {
                  // Hub API format: clean name with separate color string
                  const cleaned = cleanQuakeNameAndColor(gamePlayer.name, gamePlayer.name_color);
                  nameHtml = generateColoredHtml(cleaned.name, cleaned.color);
                } else {
                  // Byte value format: colors embedded in the name
                  nameHtml = quakeNameToColoredHtml(gamePlayer.name);
                }
              } else {
                // Fallback to byte value format
                nameHtml = quakeNameToColoredHtml(player.name);
              }
              
              playerStatsMap.set(key, {
                name: cleanName,
                name_html: nameHtml,
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
              lg_attacks: player.weapons?.lg?.acc?.attacks || 0,
              lg_hits: player.weapons?.lg?.acc?.hits || 0,
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

    // Log stats
    console.log(`Games with KTX stats: ${gamesWithStats}/${filteredGames.length} (${Math.round(gamesWithStats / filteredGames.length * 100)}%)`);
    console.log(`Games without KTX stats: ${gamesWithoutStats}`);
    console.log(`Total players found: ${playerStatsMap.size}`);
    const playersWithEnoughGames = Array.from(playerStatsMap.values()).filter(p => p.games.length >= 15);
    console.log(`Players with 15+ games: ${playersWithEnoughGames.length}`);
    
    // Calculate averages for each player
    const rankings: PlayerRanking[] = playersWithEnoughGames
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
          lg_attacks_total: acc.lg_attacks_total + game.lg_attacks,
          lg_hits_total: acc.lg_hits_total + game.lg_hits,
          quads_taken: acc.quads_taken + game.quads_taken,
          ewep: acc.ewep + game.ewep,
          to_die_sum: acc.to_die_sum + game.to_die,
        }), {
          frags: 0, deaths: 0, kills: 0, damage_given: 0, damage_taken: 0,
          team_damage: 0, tk: 0, rl_drops: 0, rl_took: 0, rl_kills: 0,
          rl_directs: 0, sg_accuracy_sum: 0, lg_attacks_total: 0, lg_hits_total: 0,
          quads_taken: 0, ewep: 0, to_die_sum: 0,
        });

        return {
          name: player.name,
          name_color: "", // Not used anymore
          name_html: player.name_html,
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
          avg_lg_accuracy: totals.lg_attacks_total > 0 ? (totals.lg_hits_total / totals.lg_attacks_total) * 100 : 0,
          avg_quads_taken: totals.quads_taken / gamesPlayed,
          avg_ewep: totals.ewep / gamesPlayed,
          avg_to_die: totals.to_die_sum / gamesPlayed,
          efficiency: calculateEfficiency(totals.kills, totals.deaths),
        };
      });

    return rankings;

  } catch (error: any) {
    if (error.name === 'AbortError') {
      // Request was aborted, don't log or re-throw
      return [];
    }
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