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

export async function getPlayerRankings(
  gameMode: string,
  region: string = "All",
  days: number = 90
): Promise<PlayerRanking[]> {
  // For development/demo purposes, return mock data
  // In production, this would fetch from Supabase and aggregate KTX stats
  
  console.log(`Fetching rankings for ${gameMode} mode in ${region} (last ${days} days)`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

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

// TODO: Implement KTX stats fetching when full aggregation is added
// Helper function to fetch KTX stats from CloudFront
// async function fetchKtxStats(sha256: string): Promise<any | null> {
//   const prefix = sha256.substring(0, 3);
//   const url = `https://d.quake.world/${prefix}/${sha256}.mvd.ktxstats.json`;
//   
//   try {
//     const response = await fetch(url);
//     if (!response.ok) return null;
//     return await response.json();
//   } catch (error) {
//     console.error(`Failed to fetch KTX stats for ${sha256}:`, error);
//     return null;
//   }
// }