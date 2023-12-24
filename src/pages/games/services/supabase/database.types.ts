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
          filename: string;
          fts: unknown | null;
          id: number;
          map: string;
          matchtag: string;
          mode: string;
          participants: Json | null;
          s3_key: string;
          sha256: string;
          source: string;
          timestamp: string | null;
          title: string;
        };
        Insert: {
          duration?: number;
          filename?: string;
          fts?: unknown | null;
          id?: number;
          map?: string;
          matchtag?: string;
          mode?: string;
          participants?: Json | null;
          s3_key?: string;
          sha256?: string;
          source?: string;
          timestamp?: string | null;
          title?: string;
        };
        Update: {
          duration?: number;
          filename?: string;
          fts?: unknown | null;
          id?: number;
          map?: string;
          matchtag?: string;
          mode?: string;
          participants?: Json | null;
          s3_key?: string;
          sha256?: string;
          source?: string;
          timestamp?: string | null;
          title?: string;
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
