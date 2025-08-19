export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      demos: {
        Row: {
          event_id: string | null
          game_id: number | null
          has_bots: boolean
          has_ktxstats: boolean
          id: number
          map: string
          matchtag: string | null
          matchtime: string
          mode: string
          players: Json
          server_hostname: string
          sha256: string
          source_url: string | null
          teams: Json
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          event_id?: string | null
          game_id?: number | null
          has_bots?: boolean
          has_ktxstats?: boolean
          id?: number
          map: string
          matchtag?: string | null
          matchtime: string
          mode: string
          players: Json
          server_hostname: string
          sha256: string
          source_url?: string | null
          teams: Json
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          event_id?: string | null
          game_id?: number | null
          has_bots?: boolean
          has_ktxstats?: boolean
          id?: number
          map?: string
          matchtag?: string | null
          matchtime?: string
          mode?: string
          players?: Json
          server_hostname?: string
          sha256?: string
          source_url?: string | null
          teams?: Json
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demos_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demos_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          abbreviation: string | null
          id: string
          name: string
          series_id: string | null
        }
        Insert: {
          abbreviation?: string | null
          id: string
          name: string
          series_id?: string | null
        }
        Update: {
          abbreviation?: string | null
          id?: string
          name?: string
          series_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      games_v2: {
        Row: {
          demo_sha256: string | null
          id: number
          is_decided: boolean
          match_id: number | null
          was_decided_by: string | null
        }
        Insert: {
          demo_sha256?: string | null
          id?: number
          is_decided?: boolean
          match_id?: number | null
          was_decided_by?: string | null
        }
        Update: {
          demo_sha256?: string | null
          id?: number
          is_decided?: boolean
          match_id?: number | null
          was_decided_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "games_v2_demo_sha256_fkey"
            columns: ["demo_sha256"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["sha256"]
          },
          {
            foreignKeyName: "games_v2_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      maps: {
        Row: {
          alteration_of: string[]
          author_id: string | null
          author_names: string[]
          feeds: string[]
          message: string
          modes: string[]
          name: string
          race_routes: Json
          readme: string
          release_date: string | null
          revisions: string[]
          tags: string[]
        }
        Insert: {
          alteration_of?: string[]
          author_id?: string | null
          author_names?: string[]
          feeds?: string[]
          message?: string
          modes?: string[]
          name: string
          race_routes?: Json
          readme?: string
          release_date?: string | null
          revisions?: string[]
          tags?: string[]
        }
        Update: {
          alteration_of?: string[]
          author_id?: string | null
          author_names?: string[]
          feeds?: string[]
          message?: string
          modes?: string[]
          name?: string
          race_routes?: Json
          readme?: string
          release_date?: string | null
          revisions?: string[]
          tags?: string[]
        }
        Relationships: []
      }
      matches: {
        Row: {
          bracket_name: string | null
          deadline: string | null
          game_count: number
          id: number
          match_format: string
          number: number
          round: number
          stage_id: number | null
        }
        Insert: {
          bracket_name?: string | null
          deadline?: string | null
          game_count: number
          id?: number
          match_format: string
          number: number
          round: number
          stage_id?: number | null
        }
        Update: {
          bracket_name?: string | null
          deadline?: string | null
          game_count?: number
          id?: number
          match_format?: string
          number?: number
          round?: number
          stage_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "stages"
            referencedColumns: ["id"]
          },
        ]
      }
      names: {
        Row: {
          ascii: string
          id: string
          unicode_uncase: string
          unicode_uncolor: string
          unicode_uncolorcase: string
          utf8: string
          utf8_fts: unknown | null
        }
        Insert: {
          ascii: string
          id: string
          unicode_uncase: string
          unicode_uncolor: string
          unicode_uncolorcase: string
          utf8: string
          utf8_fts?: unknown | null
        }
        Update: {
          ascii?: string
          id?: string
          unicode_uncase?: string
          unicode_uncolor?: string
          unicode_uncolorcase?: string
          utf8?: string
          utf8_fts?: unknown | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          auth: string | null
          cc: string
          city: string
          connection_speed: string
          connection_type: string
          cpu: string
          device_type: string
          github: string
          gpu: string
          headphones: string
          keyboard_name: string
          keyboard_switches: string
          keyboard_type: string
          microphone: string
          monitor_hz: number
          monitor_name: string
          monitor_resolution: string
          monitor_size: number
          mouse_cm360: number
          mouse_connection: string
          mouse_dpi: number
          mouse_grip: string
          mouse_hz: number
          mouse_name: string
          mousepad_material: string
          mousepad_name: string
          name: string
          nicknames: string
          os: string
          presentation: string
          qwiki: string
          ram: string
          twitch: string
          updated_at: string
          user_id: string
          youtube: string
        }
        Insert: {
          auth?: string | null
          cc?: string
          city?: string
          connection_speed?: string
          connection_type?: string
          cpu?: string
          device_type?: string
          github?: string
          gpu?: string
          headphones?: string
          keyboard_name?: string
          keyboard_switches?: string
          keyboard_type?: string
          microphone?: string
          monitor_hz?: number
          monitor_name?: string
          monitor_resolution?: string
          monitor_size?: number
          mouse_cm360?: number
          mouse_connection?: string
          mouse_dpi?: number
          mouse_grip?: string
          mouse_hz?: number
          mouse_name?: string
          mousepad_material?: string
          mousepad_name?: string
          name: string
          nicknames?: string
          os?: string
          presentation?: string
          qwiki?: string
          ram?: string
          twitch?: string
          updated_at?: string
          user_id: string
          youtube?: string
        }
        Update: {
          auth?: string | null
          cc?: string
          city?: string
          connection_speed?: string
          connection_type?: string
          cpu?: string
          device_type?: string
          github?: string
          gpu?: string
          headphones?: string
          keyboard_name?: string
          keyboard_switches?: string
          keyboard_type?: string
          microphone?: string
          monitor_hz?: number
          monitor_name?: string
          monitor_resolution?: string
          monitor_size?: number
          mouse_cm360?: number
          mouse_connection?: string
          mouse_dpi?: number
          mouse_grip?: string
          mouse_hz?: number
          mouse_name?: string
          mousepad_material?: string
          mousepad_name?: string
          name?: string
          nicknames?: string
          os?: string
          presentation?: string
          qwiki?: string
          ram?: string
          twitch?: string
          updated_at?: string
          user_id?: string
          youtube?: string
        }
        Relationships: []
      }
      series: {
        Row: {
          abbreviation: string | null
          id: string
          name: string
        }
        Insert: {
          abbreviation?: string | null
          id: string
          name: string
        }
        Update: {
          abbreviation?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      stages: {
        Row: {
          bracket_type: string
          id: number
          is_completed: boolean
          name: string
          order: number
          tournament_id: number | null
        }
        Insert: {
          bracket_type: string
          id?: number
          is_completed?: boolean
          name: string
          order: number
          tournament_id?: number | null
        }
        Update: {
          bracket_type?: string
          id?: number
          is_completed?: boolean
          name?: string
          order?: number
          tournament_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stages_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          event_id: string
          id: number
          mode: string
          name: string | null
        }
        Insert: {
          event_id: string
          id?: number
          mode: string
          name?: string | null
        }
        Update: {
          event_id?: string
          id?: number
          mode?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      v1_games: {
        Row: {
          demo_sha256: string | null
          demo_source_url: string | null
          id: number
          map: string
          matchtag: string | null
          mode: string
          players: Json
          players_fts: unknown | null
          server_hostname: string | null
          team_names: string[] | null
          teams: Json
          timestamp: string
        }
        Insert: {
          demo_sha256?: string | null
          demo_source_url?: string | null
          id?: number
          map: string
          matchtag?: string | null
          mode: string
          players: Json
          players_fts?: unknown | null
          server_hostname?: string | null
          team_names?: string[] | null
          teams: Json
          timestamp: string
        }
        Update: {
          demo_sha256?: string | null
          demo_source_url?: string | null
          id?: number
          map?: string
          matchtag?: string | null
          mode?: string
          players?: Json
          players_fts?: unknown | null
          server_hostname?: string | null
          team_names?: string[] | null
          teams?: Json
          timestamp?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_gmt_time: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      jsonb_array_to_text_array: {
        Args: { _js: Json }
        Returns: string[]
      }
      s3_key: {
        Args: { auth: string; skey: string } | { name: string }
        Returns: unknown
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      slugify: {
        Args: { value: string }
        Returns: string
      }
      unaccent: {
        Args: { "": string }
        Returns: string
      }
      unaccent_init: {
        Args: { "": unknown }
        Returns: unknown
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
