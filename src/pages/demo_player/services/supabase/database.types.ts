export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      demos: {
        Row: {
          duration: number | null
          filename: string | null
          fts: unknown | null
          id: number
          map: string | null
          mode: string | null
          players: Json | null
          s3_key: string | null
          sha256: string | null
          source: string | null
          timestamp: string | null
          title: string | null
        }
        Insert: {
          duration?: number | null
          filename?: string | null
          fts?: unknown | null
          id?: number
          map?: string | null
          mode?: string | null
          players?: Json | null
          s3_key?: string | null
          sha256?: string | null
          source?: string | null
          timestamp?: string | null
          title?: string | null
        }
        Update: {
          duration?: number | null
          filename?: string | null
          fts?: unknown | null
          id?: number
          map?: string | null
          mode?: string | null
          players?: Json | null
          s3_key?: string | null
          sha256?: string | null
          source?: string | null
          timestamp?: string | null
          title?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
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
