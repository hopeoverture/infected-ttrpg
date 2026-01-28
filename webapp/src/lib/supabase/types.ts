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
          preferences_id: string | null;
          generated_scenario_id: string | null;
          last_saved_at: string;
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
          preferences_id?: string | null;
          generated_scenario_id?: string | null;
          last_saved_at?: string;
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
          preferences_id?: string | null;
          generated_scenario_id?: string | null;
          last_saved_at?: string;
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
      characters: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          nickname: string | null;
          background: string;
          appearance: Json;
          portrait_url: string | null;
          art_style: string | null;
          attributes: Json;
          skills: Json;
          personality: Json;
          connections: Json;
          motivation: string;
          moral_code: string | null;
          survival_philosophy: string | null;
          skill_points_available: number;
          attribute_points_available: number;
          scars: Json;
          sessions_survived: number;
          times_used: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          nickname?: string | null;
          background: string;
          appearance?: Json;
          portrait_url?: string | null;
          art_style?: string | null;
          attributes: Json;
          skills: Json;
          personality?: Json;
          connections?: Json;
          motivation: string;
          moral_code?: string | null;
          survival_philosophy?: string | null;
          skill_points_available?: number;
          attribute_points_available?: number;
          scars?: Json;
          sessions_survived?: number;
          times_used?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          nickname?: string | null;
          background?: string;
          appearance?: Json;
          portrait_url?: string | null;
          art_style?: string | null;
          attributes?: Json;
          skills?: Json;
          personality?: Json;
          connections?: Json;
          motivation?: string;
          moral_code?: string | null;
          survival_philosophy?: string | null;
          skill_points_available?: number;
          attribute_points_available?: number;
          scars?: Json;
          sessions_survived?: number;
          times_used?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      game_preferences: {
        Row: {
          id: string;
          game_id: string | null;
          difficulty: 'easy' | 'standard' | 'challenging' | 'brutal';
          themes: Json;
          roleplay_focus: number;
          story_focus: number;
          combat_focus: number;
          tone: 'hopeful' | 'balanced' | 'grim' | 'nihilistic';
          created_at: string;
        };
        Insert: {
          id?: string;
          game_id?: string | null;
          difficulty?: 'easy' | 'standard' | 'challenging' | 'brutal';
          themes?: Json;
          roleplay_focus?: number;
          story_focus?: number;
          combat_focus?: number;
          tone?: 'hopeful' | 'balanced' | 'grim' | 'nihilistic';
          created_at?: string;
        };
        Update: {
          id?: string;
          game_id?: string | null;
          difficulty?: 'easy' | 'standard' | 'challenging' | 'brutal';
          themes?: Json;
          roleplay_focus?: number;
          story_focus?: number;
          combat_focus?: number;
          tone?: 'hopeful' | 'balanced' | 'grim' | 'nihilistic';
          created_at?: string;
        };
      };
      generated_scenarios: {
        Row: {
          id: string;
          game_id: string | null;
          scenario_options: Json;
          selected_option: number | null;
          full_scenario: Json | null;
          generated_at: string;
          finalized_at: string | null;
        };
        Insert: {
          id?: string;
          game_id?: string | null;
          scenario_options?: Json;
          selected_option?: number | null;
          full_scenario?: Json | null;
          generated_at?: string;
          finalized_at?: string | null;
        };
        Update: {
          id?: string;
          game_id?: string | null;
          scenario_options?: Json;
          selected_option?: number | null;
          full_scenario?: Json | null;
          generated_at?: string;
          finalized_at?: string | null;
        };
      };
      npc_history: {
        Row: {
          id: string;
          game_id: string;
          npc_id: string;
          state_snapshot: Json;
          change_type: string;
          change_description: string | null;
          game_day: number;
          game_time: string | null;
          message_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          npc_id: string;
          state_snapshot: Json;
          change_type: string;
          change_description?: string | null;
          game_day: number;
          game_time?: string | null;
          message_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          game_id?: string;
          npc_id?: string;
          state_snapshot?: Json;
          change_type?: string;
          change_description?: string | null;
          game_day?: number;
          game_time?: string | null;
          message_id?: string | null;
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
      search_game_messages: {
        Args: { p_game_id: string; p_query: string; p_limit?: number };
        Returns: Array<{
          id: string;
          content: string;
          role: string;
          created_at: string;
          rank: number;
        }>;
      };
    };
  };
}

// Helper type for game summary from view
export type GameSummaryRow = Database['public']['Views']['game_summaries']['Row'];

// Helper type for converting DB row to app types
export type GameRow = Database['public']['Tables']['games']['Row'];
export type MessageRow = Database['public']['Tables']['messages']['Row'];
export type CharacterRow = Database['public']['Tables']['characters']['Row'];
export type GamePreferencesRow = Database['public']['Tables']['game_preferences']['Row'];
export type GeneratedScenariosRow = Database['public']['Tables']['generated_scenarios']['Row'];
export type NPCHistoryRow = Database['public']['Tables']['npc_history']['Row'];
