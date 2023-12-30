export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      demos: {
        Row: {
          duration: number;
          event_id: number | null;
          filename: string;
          fts: unknown | null;
          id: number;
          map: string;
          matchtag: string;
          mode: string;
          participants: Json | null;
          participants_sha256: string;
          s3_key: string;
          sha256: string;
          source: string;
          timestamp: string | null;
          title: string;
        };
        Insert: {
          duration?: number;
          event_id?: number | null;
          filename?: string;
          fts?: unknown | null;
          id?: number;
          map?: string;
          matchtag?: string;
          mode?: string;
          participants?: Json | null;
          participants_sha256?: string;
          s3_key?: string;
          sha256?: string;
          source?: string;
          timestamp?: string | null;
          title?: string;
        };
        Update: {
          duration?: number;
          event_id?: number | null;
          filename?: string;
          fts?: unknown | null;
          id?: number;
          map?: string;
          matchtag?: string;
          mode?: string;
          participants?: Json | null;
          participants_sha256?: string;
          s3_key?: string;
          sha256?: string;
          source?: string;
          timestamp?: string | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "demos_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: {
          date: string | null;
          id: number;
          name: string;
          s3_dirname: string;
        };
        Insert: {
          date?: string | null;
          id?: number;
          name?: string;
          s3_dirname?: string;
        };
        Update: {
          date?: string | null;
          id?: number;
          name?: string;
          s3_dirname?: string;
        };
        Relationships: [];
      };
      ignored_demos: {
        Row: {
          filename: string;
          id: number;
          mode: string;
          reason: string;
          sha256: string;
        };
        Insert: {
          filename?: string;
          id?: number;
          mode: string;
          reason?: string;
          sha256: string;
        };
        Update: {
          filename?: string;
          id?: number;
          mode?: string;
          reason?: string;
          sha256?: string;
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
        Returns: unknown;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
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
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
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
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
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
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;
