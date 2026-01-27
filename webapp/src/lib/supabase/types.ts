// Supabase Database Types
// These match the schema.sql definitions
// Note: Json fields contain Character, GameState, and RollResult types from ../types

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
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      games: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          character: Json;
          day: number;
          time_of_day: 'night' | 'dawn' | 'day' | 'dusk';
          location: Json;
          threat: number;
          threat_state: 'safe' | 'noticed' | 'investigating' | 'encounter' | 'swarm';
          party: Json;
          objectives: Json;
          combat_state: Json | null;
          session_start_time: string | null;
          roll_count: number;
          kill_count: number;
          is_game_over: boolean;
          death_day: number | null;
          death_cause: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          character: Json;
          day?: number;
          time_of_day?: 'night' | 'dawn' | 'day' | 'dusk';
          location: Json;
          threat?: number;
          threat_state?: 'safe' | 'noticed' | 'investigating' | 'encounter' | 'swarm';
          party?: Json;
          objectives?: Json;
          combat_state?: Json | null;
          session_start_time?: string | null;
          roll_count?: number;
          kill_count?: number;
          is_game_over?: boolean;
          death_day?: number | null;
          death_cause?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          character?: Json;
          day?: number;
          time_of_day?: 'night' | 'dawn' | 'day' | 'dusk';
          location?: Json;
          threat?: number;
          threat_state?: 'safe' | 'noticed' | 'investigating' | 'encounter' | 'swarm';
          party?: Json;
          objectives?: Json;
          combat_state?: Json | null;
          session_start_time?: string | null;
          roll_count?: number;
          kill_count?: number;
          is_game_over?: boolean;
          death_day?: number | null;
          death_cause?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          game_id: string;
          role: 'gm' | 'player' | 'system';
          content: string;
          roll_data: Json | null;
          sequence_num: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          role: 'gm' | 'player' | 'system';
          content: string;
          roll_data?: Json | null;
          sequence_num: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          game_id?: string;
          role?: 'gm' | 'player' | 'system';
          content?: string;
          roll_data?: Json | null;
          sequence_num?: number;
          created_at?: string;
        };
      };
    };
    Views: {
      game_summaries: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          character_name: string;
          background: string;
          day: number;
          threat: number;
          is_game_over: boolean;
          death_day: number | null;
          updated_at: string;
          created_at: string;
        };
      };
    };
    Functions: {
      get_next_message_sequence: {
        Args: { p_game_id: string };
        Returns: number;
      };
    };
  };
}

// Helper type for game summary from view
export type GameSummaryRow = Database['public']['Views']['game_summaries']['Row'];

// Helper type for converting DB row to app types
export type GameRow = Database['public']['Tables']['games']['Row'];
export type MessageRow = Database['public']['Tables']['messages']['Row'];
