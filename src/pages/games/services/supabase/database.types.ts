export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      demos: {
        Row: {
          demo_source_url: string | null;
          duration: number;
          filename: string;
          fts: unknown | null;
          id: number;
          map: string;
          matchtag: string;
          mode: string;
          participants: Json | null;
          participants_sha256: string;
          qtv_address: string | null;
          s3_key: string;
          sha256: string;
          source: string;
          timestamp: string | null;
          title: string;
        };
        Insert: {
          demo_source_url?: string | null;
          duration?: number;
          filename?: string;
          fts?: unknown | null;
          id?: number;
          map?: string;
          matchtag?: string;
          mode?: string;
          participants?: Json | null;
          participants_sha256?: string;
          qtv_address?: string | null;
          s3_key?: string;
          sha256?: string;
          source?: string;
          timestamp?: string | null;
          title?: string;
        };
        Update: {
          demo_source_url?: string | null;
          duration?: number;
          filename?: string;
          fts?: unknown | null;
          id?: number;
          map?: string;
          matchtag?: string;
          mode?: string;
          participants?: Json | null;
          participants_sha256?: string;
          qtv_address?: string | null;
          s3_key?: string;
          sha256?: string;
          source?: string;
          timestamp?: string | null;
          title?: string;
        };
        Relationships: [];
      };
      games: {
        Row: {
          demo_sha256: string | null;
          demo_source_url: string | null;
          id: number;
          map: string;
          matchtag: string | null;
          mode: string;
          players: Json;
          players_fts: unknown | null;
          server_hostname: string | null;
          team_names: string[] | null;
          teams: Json;
          timestamp: string;
        };
        Insert: {
          demo_sha256?: string | null;
          demo_source_url?: string | null;
          id?: number;
          map: string;
          matchtag?: string | null;
          mode: string;
          players: Json;
          players_fts?: unknown | null;
          server_hostname?: string | null;
          team_names?: string[] | null;
          teams: Json;
          timestamp: string;
        };
        Update: {
          demo_sha256?: string | null;
          demo_source_url?: string | null;
          id?: number;
          map?: string;
          matchtag?: string | null;
          mode?: string;
          players?: Json;
          players_fts?: unknown | null;
          server_hostname?: string | null;
          team_names?: string[] | null;
          teams?: Json;
          timestamp?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_current_gmt_time: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      gtrgm_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gtrgm_decompress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gtrgm_in: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gtrgm_options: {
        Args: {
          "": unknown;
        };
        Returns: undefined;
      };
      gtrgm_out: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      jsonb_array_to_text_array: {
        Args: {
          _js: Json;
        };
        Returns: string[];
      };
      s3_key:
        | {
            Args: {
              name: string;
            };
            Returns: unknown;
          }
        | {
            Args: {
              skey: string;
              auth: string;
            };
            Returns: unknown;
          };
      set_limit: {
        Args: {
          "": number;
        };
        Returns: number;
      };
      show_limit: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      show_trgm: {
        Args: {
          "": string;
        };
        Returns: string[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
